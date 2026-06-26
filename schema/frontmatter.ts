/**
 * Frontmatter SSOT for samchil.dev/blog posts.
 * Field names are FIXED by the playbook (blog.md §4). The main site renderer
 * consumes these exact fields to build hreflang / canonical / JSON-LD.
 */
import { z } from "zod";

export const LEVELS = ["L1", "L2", "L3", "L4"] as const;
/** 4축 — /docs·/grades·Samchil_Grade_Criteria 와 반드시 동일 용어 */
export const AXES = ["access", "input", "failsafe", "trace"] as const;
export const LANGS = ["ko", "en"] as const;

export const FrontmatterSchema = z
  .object({
    title: z.string().min(1).max(60), // 위협/개념어 포함, 60자 이내
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "영문 케밥 케이스"),
    lang: z.enum(LANGS),
    level: z.enum(LEVELS),
    axis: z.array(z.enum(AXES)).min(1).max(2),
    series: z.string().optional(),
    description: z.string().min(1).max(155), // 롱테일 키워드 1개 포함(수동 게이트)
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    canonical: z.string().url(), // 자기 언어 원본 URL
    hreflang: z.string().url(), // 짝 언어 글 URL
    module: z.string().optional(),
    /** 스텁/작성중 표시. true면 품질게이트가 '경고'로만 처리하고 발행 대상에서 제외. */
    draft: z.boolean().optional(),
  })
  .strict();

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
