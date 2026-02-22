/**
 * kit.json manifest validator
 *
 * Implements the three-stage validation pipeline described in the design doc:
 *   Stage 1 — Required field presence and type checks
 *   Stage 2 — Security static analysis (allowlist / blocklist rules)
 *   Stage 3 — Content plausibility checks (format-only; no network calls in mock)
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  stage: 'schema' | 'security' | 'content' | 'all';
  errors: ValidationError[];
  warnings: ValidationWarning[];
  securityScore: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ALLOWED_MCP_COMMANDS = new Set(['npx', 'node', 'python', 'uvx']);

const VALID_CATEGORIES = new Set([
  'website',
  'frontend',
  'backend',
  'fullstack',
  'devops',
  'mobile',
  'data',
  'content',
]);

const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/;

const SEMVER_RANGE_PATTERN = /^>=\d+\.\d+\.\d+$/;

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{2,62}[a-z0-9]$/;

const SKILL_AGENT_PATTERN = /^[a-z0-9-]+:[a-z0-9-]+$/;

const TAG_PATTERN = /^[a-z0-9-]+$/;

const SUGGESTED_COMMAND_PATTERN = /^\/[a-zA-Z][a-zA-Z0-9 -]*$/;

// Patterns that indicate dangerous content in args (absolute paths, pipe chars, semicolons)
const DANGEROUS_ARG_PATTERNS = [
  /^\/etc\//,
  /^\/usr\//,
  /^\/bin\//,
  /^\/var\//,
  /^\/tmp\//,
  /\|/,
  /&&/,
  /;/,
  /^https?:\/\//,
  /\.\.\//,
];

// HTML/script injection patterns for claudeMd.append
const DANGEROUS_MD_PATTERNS = [/<script/i, /<iframe/i, /javascript:/i, /on\w+\s*=/i, /data:text\/html/i];

// System commands that must not appear in suggestedCommand
const FORBIDDEN_SYSTEM_COMMANDS = ['rm', 'curl', 'wget', 'bash', 'sh', 'eval', 'exec', 'chmod', 'sudo'];

// ─── Stage 1: Schema Validation ─────────────────────────────────────────────

function validateSchema(manifest: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required top-level fields
  const requiredFields = ['name', 'displayName', 'version', 'description', 'category', 'difficulty', 'icon', 'author', 'includes'];
  for (const field of requiredFields) {
    if (manifest[field] === undefined || manifest[field] === null) {
      errors.push({ field: `manifest.${field}`, message: `${field} is required` });
    }
  }

  // name
  if (typeof manifest.name === 'string') {
    if (!NAME_PATTERN.test(manifest.name)) {
      errors.push({
        field: 'manifest.name',
        message: 'name must match pattern ^[a-z0-9][a-z0-9-]{2,62}[a-z0-9]$ (4-64 chars, lowercase alphanumeric and hyphens)',
      });
    }
  } else if (manifest.name !== undefined) {
    errors.push({ field: 'manifest.name', message: 'name must be a string' });
  }

  // version
  if (typeof manifest.version === 'string') {
    if (!SEMVER_PATTERN.test(manifest.version)) {
      errors.push({ field: 'manifest.version', message: 'version must be valid semver (e.g. "1.0.0", "2.1.3-beta")' });
    }
  } else if (manifest.version !== undefined) {
    errors.push({ field: 'manifest.version', message: 'version must be a string' });
  }

  // displayName
  if (manifest.displayName !== null && typeof manifest.displayName === 'object') {
    const dn = manifest.displayName as Record<string, unknown>;
    if (typeof dn.en !== 'string' || dn.en.trim() === '') {
      errors.push({ field: 'manifest.displayName.en', message: 'displayName.en is required and must be a non-empty string' });
    }
    if (typeof dn.en === 'string' && dn.en.length > 100) {
      errors.push({ field: 'manifest.displayName.en', message: 'displayName.en must not exceed 100 characters' });
    }
    if (dn.ko !== undefined && (typeof dn.ko !== 'string' || (dn.ko as string).length > 100)) {
      errors.push({ field: 'manifest.displayName.ko', message: 'displayName.ko must be a string not exceeding 100 characters' });
    }
  } else if (manifest.displayName !== undefined) {
    errors.push({ field: 'manifest.displayName', message: 'displayName must be an object with at least an "en" property' });
  }

  // description
  if (manifest.description !== null && typeof manifest.description === 'object') {
    const desc = manifest.description as Record<string, unknown>;
    if (typeof desc.en !== 'string' || desc.en.trim() === '') {
      errors.push({ field: 'manifest.description.en', message: 'description.en is required and must be a non-empty string' });
    }
    if (typeof desc.en === 'string' && desc.en.length > 500) {
      errors.push({ field: 'manifest.description.en', message: 'description.en must not exceed 500 characters' });
    }
    if (desc.ko !== undefined && (typeof desc.ko !== 'string' || (desc.ko as string).length > 500)) {
      errors.push({ field: 'manifest.description.ko', message: 'description.ko must be a string not exceeding 500 characters' });
    }
  } else if (manifest.description !== undefined) {
    errors.push({ field: 'manifest.description', message: 'description must be an object with at least an "en" property' });
  }

  // category
  if (typeof manifest.category === 'string') {
    if (!VALID_CATEGORIES.has(manifest.category)) {
      errors.push({
        field: 'manifest.category',
        message: `category must be one of: ${Array.from(VALID_CATEGORIES).join(', ')}`,
      });
    }
  } else if (manifest.category !== undefined) {
    errors.push({ field: 'manifest.category', message: 'category must be a string' });
  }

  // difficulty
  if (manifest.difficulty !== undefined) {
    const d = manifest.difficulty;
    if (typeof d !== 'number' || !Number.isInteger(d) || d < 1 || d > 3) {
      errors.push({ field: 'manifest.difficulty', message: 'difficulty must be an integer 1, 2, or 3' });
    }
  }

  // icon
  if (manifest.icon !== undefined && typeof manifest.icon !== 'string') {
    errors.push({ field: 'manifest.icon', message: 'icon must be a string' });
  }
  if (typeof manifest.icon === 'string' && manifest.icon.length > 50) {
    errors.push({ field: 'manifest.icon', message: 'icon must not exceed 50 characters' });
  }

  // author
  if (manifest.author !== undefined && typeof manifest.author !== 'string') {
    errors.push({ field: 'manifest.author', message: 'author must be a string (slug)' });
  }

  // tags
  if (manifest.tags !== undefined) {
    if (!Array.isArray(manifest.tags)) {
      errors.push({ field: 'manifest.tags', message: 'tags must be an array' });
    } else {
      if (manifest.tags.length > 10) {
        errors.push({ field: 'manifest.tags', message: 'tags must have at most 10 items' });
      }
      manifest.tags.forEach((tag, index) => {
        if (typeof tag !== 'string' || !TAG_PATTERN.test(tag)) {
          errors.push({
            field: `manifest.tags[${index}]`,
            message: `tag "${tag}" must match pattern ^[a-z0-9-]+$ (max 30 chars)`,
          });
        }
      });
    }
  }

  // includes
  if (manifest.includes !== null && typeof manifest.includes === 'object') {
    const includes = manifest.includes as Record<string, unknown>;

    // skills
    if (includes.skills !== undefined) {
      if (!Array.isArray(includes.skills)) {
        errors.push({ field: 'manifest.includes.skills', message: 'skills must be an array' });
      } else {
        if (includes.skills.length > 20) {
          errors.push({ field: 'manifest.includes.skills', message: 'skills must have at most 20 items' });
        }
        includes.skills.forEach((skill, i) => {
          if (typeof skill !== 'string' || !SKILL_AGENT_PATTERN.test(skill)) {
            errors.push({
              field: `manifest.includes.skills[${i}]`,
              message: `skill "${skill}" must match format {registry}:{skill-name} (e.g. "bkit:starter")`,
            });
          }
        });
      }
    }

    // agents
    if (includes.agents !== undefined) {
      if (!Array.isArray(includes.agents)) {
        errors.push({ field: 'manifest.includes.agents', message: 'agents must be an array' });
      } else {
        if (includes.agents.length > 10) {
          errors.push({ field: 'manifest.includes.agents', message: 'agents must have at most 10 items' });
        }
        includes.agents.forEach((agent, i) => {
          if (typeof agent !== 'string' || !SKILL_AGENT_PATTERN.test(agent)) {
            errors.push({
              field: `manifest.includes.agents[${i}]`,
              message: `agent "${agent}" must match format {registry}:{agent-name}`,
            });
          }
        });
      }
    }

    // templates
    if (includes.templates !== undefined) {
      if (!Array.isArray(includes.templates)) {
        errors.push({ field: 'manifest.includes.templates', message: 'templates must be an array' });
      } else if (includes.templates.length > 5) {
        errors.push({ field: 'manifest.includes.templates', message: 'templates must have at most 5 items' });
      }
    }
  } else if (manifest.includes !== undefined) {
    errors.push({ field: 'manifest.includes', message: 'includes must be an object' });
  }

  // requires (optional)
  if (manifest.requires !== undefined && (typeof manifest.requires !== 'object' || manifest.requires === null)) {
    errors.push({ field: 'manifest.requires', message: 'requires must be an object' });
  }
  if (manifest.requires !== null && typeof manifest.requires === 'object') {
    const req = manifest.requires as Record<string, unknown>;
    for (const key of ['claudeCode', 'bkit', 'node'] as const) {
      if (req[key] !== undefined) {
        if (typeof req[key] !== 'string' || !SEMVER_RANGE_PATTERN.test(req[key] as string)) {
          errors.push({
            field: `manifest.requires.${key}`,
            message: `requires.${key} must be a semver range like ">=1.0.0"`,
          });
        }
      }
    }
  }

  return errors;
}

// ─── Stage 2: Security Static Analysis ──────────────────────────────────────

function validateSecurity(manifest: Record<string, unknown>): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  deductions: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let deductions = 0;

  const includes = manifest.includes as Record<string, unknown> | undefined;

  // mcpServers
  if (includes?.mcpServers && typeof includes.mcpServers === 'object') {
    const servers = includes.mcpServers as Record<string, unknown>;

    if (Object.keys(servers).length > 5) {
      errors.push({ field: 'manifest.includes.mcpServers', message: 'mcpServers must have at most 5 entries' });
      deductions += 10;
    }

    for (const [serverName, serverConfig] of Object.entries(servers)) {
      if (typeof serverConfig !== 'object' || serverConfig === null) continue;
      const config = serverConfig as Record<string, unknown>;
      const field = `manifest.includes.mcpServers.${serverName}`;

      // command allowlist
      if (config.command !== undefined) {
        if (!ALLOWED_MCP_COMMANDS.has(config.command as string)) {
          errors.push({
            field: `${field}.command`,
            message: `command "${config.command}" is not allowed. Only: ${Array.from(ALLOWED_MCP_COMMANDS).join(', ')}`,
          });
          deductions += 30;
        }
      }

      // args safety
      if (Array.isArray(config.args)) {
        if (config.args.length > 10) {
          errors.push({ field: `${field}.args`, message: 'args must have at most 10 items' });
          deductions += 5;
        }
        config.args.forEach((arg, i) => {
          if (typeof arg !== 'string') return;
          for (const pattern of DANGEROUS_ARG_PATTERNS) {
            if (pattern.test(arg)) {
              errors.push({
                field: `${field}.args[${i}]`,
                message: `arg "${arg}" contains a forbidden pattern (absolute path, pipe, semicolon, or URL)`,
              });
              deductions += 20;
              break;
            }
          }
          // Warn on unpinned npm packages
          if (/^@/.test(arg) && !arg.includes('@', 1)) {
            warnings.push({
              field: `${field}.args[${i}]`,
              message: `npm package version not pinned: ${arg}`,
            });
          }
        });
      }

      // env values must only be ${ENV_VAR} references
      if (config.env && typeof config.env === 'object') {
        const env = config.env as Record<string, unknown>;
        if (Object.keys(env).length > 5) {
          errors.push({ field: `${field}.env`, message: 'env must have at most 5 entries' });
          deductions += 5;
        }
        for (const [key, value] of Object.entries(env)) {
          if (typeof value !== 'string' || !/^\$\{[A-Z_]+\}$/.test(value)) {
            errors.push({
              field: `${field}.env.${key}`,
              message: `env value must be a reference in the form "\${ENV_VAR}". Hardcoded secrets are not allowed.`,
            });
            deductions += 25;
          }
        }
      }

      // url must be https://
      if (config.url !== undefined) {
        if (typeof config.url !== 'string' || !config.url.startsWith('https://')) {
          errors.push({ field: `${field}.url`, message: 'url must start with https://' });
          deductions += 15;
        }
        if (typeof config.url === 'string' && /(localhost|127\.0\.0\.1|192\.168\.|10\.\d+\.)/.test(config.url)) {
          errors.push({ field: `${field}.url`, message: 'url must not point to localhost or internal IP addresses' });
          deductions += 20;
        }
      }
    }
  }

  // claudeMd.append — check for script injection
  if (includes?.claudeMd && typeof includes.claudeMd === 'object') {
    const claudeMd = includes.claudeMd as Record<string, unknown>;
    if (typeof claudeMd.append === 'string') {
      if (claudeMd.append.length > 2000) {
        errors.push({ field: 'manifest.includes.claudeMd.append', message: 'claudeMd.append must not exceed 2000 characters' });
        deductions += 5;
      }
      for (const pattern of DANGEROUS_MD_PATTERNS) {
        if (pattern.test(claudeMd.append)) {
          errors.push({
            field: 'manifest.includes.claudeMd.append',
            message: 'claudeMd.append contains forbidden content (HTML tags, script, or javascript: URI)',
          });
          deductions += 30;
          break;
        }
      }
      // Base64-like large encoded strings are suspicious
      if (/[A-Za-z0-9+/]{100,}={0,2}/.test(claudeMd.append)) {
        warnings.push({
          field: 'manifest.includes.claudeMd.append',
          message: 'claudeMd.append contains a long base64-like string which may be obfuscated content',
        });
        deductions += 10;
      }
    }
  }

  // onInstall checks
  if (manifest.onInstall && typeof manifest.onInstall === 'object') {
    const onInstall = manifest.onInstall as Record<string, unknown>;

    if (onInstall.suggestedCommand !== undefined) {
      if (typeof onInstall.suggestedCommand !== 'string') {
        errors.push({ field: 'manifest.onInstall.suggestedCommand', message: 'suggestedCommand must be a string' });
        deductions += 5;
      } else {
        if (!SUGGESTED_COMMAND_PATTERN.test(onInstall.suggestedCommand)) {
          errors.push({
            field: 'manifest.onInstall.suggestedCommand',
            message: 'suggestedCommand must start with "/" and contain only letters, numbers, spaces, and hyphens',
          });
          deductions += 10;
        }
        for (const cmd of FORBIDDEN_SYSTEM_COMMANDS) {
          if (onInstall.suggestedCommand.includes(cmd)) {
            errors.push({
              field: 'manifest.onInstall.suggestedCommand',
              message: `suggestedCommand contains forbidden system command: "${cmd}"`,
            });
            deductions += 30;
          }
        }
        if ((onInstall.suggestedCommand as string).length > 100) {
          errors.push({ field: 'manifest.onInstall.suggestedCommand', message: 'suggestedCommand must not exceed 100 characters' });
        }
      }
    }

    if (onInstall.guideUrl !== undefined) {
      if (typeof onInstall.guideUrl !== 'string' || !onInstall.guideUrl.startsWith('https://')) {
        errors.push({ field: 'manifest.onInstall.guideUrl', message: 'guideUrl must start with https://' });
        deductions += 10;
      }
      if (typeof onInstall.guideUrl === 'string' && (onInstall.guideUrl as string).length > 500) {
        errors.push({ field: 'manifest.onInstall.guideUrl', message: 'guideUrl must not exceed 500 characters' });
      }
    }
  }

  return { errors, warnings, deductions };
}

// ─── Stage 3: Content Plausibility ──────────────────────────────────────────

function validateContent(manifest: Record<string, unknown>): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  deductions: number;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let deductions = 0;

  const includes = manifest.includes as Record<string, unknown> | undefined;

  // Warn if no skills and no agents — an empty Kit is unhelpful
  const hasSkills = Array.isArray(includes?.skills) && (includes?.skills as unknown[]).length > 0;
  const hasAgents = Array.isArray(includes?.agents) && (includes?.agents as unknown[]).length > 0;
  const hasMcp = includes?.mcpServers && Object.keys(includes.mcpServers as object).length > 0;

  if (!hasSkills && !hasAgents && !hasMcp) {
    warnings.push({
      field: 'manifest.includes',
      message: 'Kit includes no skills, agents, or MCP servers. Consider adding at least one component.',
    });
    deductions += 5;
  }

  // Warn if no description.ko (Korean audience expected)
  if (manifest.description && typeof manifest.description === 'object') {
    const desc = manifest.description as Record<string, unknown>;
    if (!desc.ko) {
      warnings.push({
        field: 'manifest.description.ko',
        message: 'No Korean description provided. Adding one improves discoverability for Korean users.',
      });
    }
  }

  // Warn if no tags
  if (!Array.isArray(manifest.tags) || (manifest.tags as unknown[]).length === 0) {
    warnings.push({
      field: 'manifest.tags',
      message: 'No tags provided. Tags improve search discoverability.',
    });
    deductions += 3;
  }

  // Warn if no onInstall message
  if (!manifest.onInstall) {
    warnings.push({
      field: 'manifest.onInstall',
      message: 'No onInstall message provided. Consider adding a welcome message and suggested first command.',
    });
  }

  return { errors, warnings, deductions };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Validate a raw kit.json manifest object.
 * Returns a ValidationResult with errors, warnings, and a security score (0-100).
 */
export function validateManifest(manifest: unknown): ValidationResult {
  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
    return {
      passed: false,
      stage: 'schema',
      errors: [{ field: 'manifest', message: 'Manifest must be a JSON object' }],
      warnings: [],
      securityScore: 0,
    };
  }

  const raw = manifest as Record<string, unknown>;

  // Stage 1
  const schemaErrors = validateSchema(raw);
  if (schemaErrors.length > 0) {
    return {
      passed: false,
      stage: 'schema',
      errors: schemaErrors,
      warnings: [],
      securityScore: 0,
    };
  }

  // Stage 2
  const { errors: secErrors, warnings: secWarnings, deductions: secDeductions } = validateSecurity(raw);
  if (secErrors.length > 0) {
    return {
      passed: false,
      stage: 'security',
      errors: secErrors,
      warnings: secWarnings,
      securityScore: Math.max(0, 100 - secDeductions),
    };
  }

  // Stage 3
  const { errors: contentErrors, warnings: contentWarnings, deductions: contentDeductions } = validateContent(raw);
  if (contentErrors.length > 0) {
    return {
      passed: false,
      stage: 'content',
      errors: contentErrors,
      warnings: [...secWarnings, ...contentWarnings],
      securityScore: Math.max(0, 100 - secDeductions - contentDeductions),
    };
  }

  return {
    passed: true,
    stage: 'all',
    errors: [],
    warnings: [...secWarnings, ...contentWarnings],
    securityScore: Math.max(0, 100 - secDeductions - contentDeductions),
  };
}
