/**
 * @ardurai/contracts/zod — Tier-2 structural Zod schemas.
 *
 * Requires the `zod` peer dependency (^3).
 * Import via the subpath so Tier-1-only consumers pull no zod dep:
 *
 *   import { AggregationArtifactSchema } from '@ardurai/contracts/zod';
 *
 * All schemas use .passthrough() on the envelope level to remain forward-compatible
 * with additive revisions — unknown fields are preserved, not stripped.
 */
import { z } from 'zod';
export declare const AggregationArtifactSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"aggregation">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        itemsByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        clustersByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        coverageByTopic: z.ZodRecord<z.ZodString, z.ZodObject<{
            sourcesConfigured: z.ZodNumber;
            sourcesQueried: z.ZodNumber;
            sourcesResponded: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            degraded: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        itemsByTopic: Record<string, z.objectOutputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">[]>;
        clustersByTopic: Record<string, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        coverageByTopic: Record<string, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>;
    }, {
        itemsByTopic: Record<string, z.objectInputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">[]>;
        clustersByTopic: Record<string, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        coverageByTopic: Record<string, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>;
    }>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"aggregation">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        itemsByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        clustersByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        coverageByTopic: z.ZodRecord<z.ZodString, z.ZodObject<{
            sourcesConfigured: z.ZodNumber;
            sourcesQueried: z.ZodNumber;
            sourcesResponded: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            degraded: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        itemsByTopic: Record<string, z.objectOutputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">[]>;
        clustersByTopic: Record<string, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        coverageByTopic: Record<string, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>;
    }, {
        itemsByTopic: Record<string, z.objectInputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">[]>;
        clustersByTopic: Record<string, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        coverageByTopic: Record<string, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>;
    }>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"aggregation">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        itemsByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        clustersByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        coverageByTopic: z.ZodRecord<z.ZodString, z.ZodObject<{
            sourcesConfigured: z.ZodNumber;
            sourcesQueried: z.ZodNumber;
            sourcesResponded: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            degraded: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        itemsByTopic: Record<string, z.objectOutputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">[]>;
        clustersByTopic: Record<string, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        coverageByTopic: Record<string, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>;
    }, {
        itemsByTopic: Record<string, z.objectInputType<{
            id: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            title: z.ZodString;
            source: z.ZodString;
            sourceDomain: z.ZodString;
            sourceUrl: z.ZodString;
            url: z.ZodString;
            tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
            publishedAt: z.ZodString;
            summaryHint: z.ZodString;
            interaction: z.ZodObject<{
                feedRank: z.ZodNullable<z.ZodNumber>;
                shares: z.ZodNullable<z.ZodNumber>;
                comments: z.ZodNullable<z.ZodNumber>;
                reactions: z.ZodNullable<z.ZodNumber>;
                crossSourceMentions: z.ZodNumber;
                velocity: z.ZodNullable<z.ZodNumber>;
                capturedAt: z.ZodString;
                provenance: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }, {
                feedRank: number | null;
                shares: number | null;
                comments: number | null;
                reactions: number | null;
                crossSourceMentions: number;
                velocity: number | null;
                capturedAt: string;
                provenance: string;
            }>;
            clusterId: z.ZodString;
            fingerprint: z.ZodString;
            claims: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, z.ZodTypeAny, "passthrough">[]>;
        clustersByTopic: Record<string, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            memberIds: z.ZodArray<z.ZodString, "many">;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        coverageByTopic: Record<string, {
            distinctDomains: number;
            sourcesConfigured: number;
            sourcesQueried: number;
            sourcesResponded: number;
            degraded: boolean;
        }>;
    }>;
}, z.ZodTypeAny, "passthrough">>;
export type AggregationArtifactInput = z.input<typeof AggregationArtifactSchema>;
export declare const RankingArtifactSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"ranking">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        rankedByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        audit: z.ZodArray<z.ZodObject<{
            auditId: z.ZodString;
            clusterId: z.ZodString;
            topic: z.ZodString;
            inputs: z.ZodRecord<z.ZodString, z.ZodNumber>;
            weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            computed: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            rationale: z.ZodString;
            weightProfile: z.ZodString;
            rankedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }, {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }>, "many">;
        weightProfile: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        weightProfile: string;
        rankedByTopic: Record<string, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        audit: {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }[];
    }, {
        weightProfile: string;
        rankedByTopic: Record<string, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        audit: {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }[];
    }>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"ranking">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        rankedByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        audit: z.ZodArray<z.ZodObject<{
            auditId: z.ZodString;
            clusterId: z.ZodString;
            topic: z.ZodString;
            inputs: z.ZodRecord<z.ZodString, z.ZodNumber>;
            weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            computed: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            rationale: z.ZodString;
            weightProfile: z.ZodString;
            rankedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }, {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }>, "many">;
        weightProfile: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        weightProfile: string;
        rankedByTopic: Record<string, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        audit: {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }[];
    }, {
        weightProfile: string;
        rankedByTopic: Record<string, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        audit: {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }[];
    }>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"ranking">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        rankedByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        audit: z.ZodArray<z.ZodObject<{
            auditId: z.ZodString;
            clusterId: z.ZodString;
            topic: z.ZodString;
            inputs: z.ZodRecord<z.ZodString, z.ZodNumber>;
            weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            computed: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            rationale: z.ZodString;
            weightProfile: z.ZodString;
            rankedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }, {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }>, "many">;
        weightProfile: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        weightProfile: string;
        rankedByTopic: Record<string, z.objectOutputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        audit: {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }[];
    }, {
        weightProfile: string;
        rankedByTopic: Record<string, z.objectInputType<{
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            rank: z.ZodNumber;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            verification: z.ZodEnum<["multi-source", "single-source"]>;
            sourceCount: z.ZodNumber;
            distinctDomains: z.ZodNumber;
            tierHistogram: z.ZodObject<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                primary: z.ZodOptional<z.ZodNumber>;
                paper: z.ZodOptional<z.ZodNumber>;
                news: z.ZodOptional<z.ZodNumber>;
                'technical-news': z.ZodOptional<z.ZodNumber>;
                'security-news': z.ZodOptional<z.ZodNumber>;
            }, z.ZodTypeAny, "passthrough">>;
            memberIds: z.ZodArray<z.ZodString, "many">;
            earliestPublishedAt: z.ZodString;
            latestPublishedAt: z.ZodString;
            auditId: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[]>;
        audit: {
            topic: string;
            clusterId: string;
            weights: Record<string, number>;
            auditId: string;
            inputs: Record<string, number>;
            computed: {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            };
            rationale: string;
            weightProfile: string;
            rankedAt: string;
        }[];
    }>;
}, z.ZodTypeAny, "passthrough">>;
export type RankingArtifactInput = z.input<typeof RankingArtifactSchema>;
export declare const Top10ArtifactSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"top10">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        nextRefreshAt: z.ZodString;
        topicsCovered: z.ZodArray<z.ZodString, "many">;
        top10ByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        global: z.ZodArray<z.ZodObject<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        stability: z.ZodObject<{
            carriedOver: z.ZodNumber;
            fresh: z.ZodNumber;
            churnRate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        }, {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        nextRefreshAt: string;
        topicsCovered: string[];
        top10ByTopic: Record<string, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[]>;
        global: z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[];
        stability: {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        };
    }, {
        nextRefreshAt: string;
        topicsCovered: string[];
        top10ByTopic: Record<string, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[]>;
        global: z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[];
        stability: {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        };
    }>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"top10">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        nextRefreshAt: z.ZodString;
        topicsCovered: z.ZodArray<z.ZodString, "many">;
        top10ByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        global: z.ZodArray<z.ZodObject<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        stability: z.ZodObject<{
            carriedOver: z.ZodNumber;
            fresh: z.ZodNumber;
            churnRate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        }, {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        nextRefreshAt: string;
        topicsCovered: string[];
        top10ByTopic: Record<string, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[]>;
        global: z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[];
        stability: {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        };
    }, {
        nextRefreshAt: string;
        topicsCovered: string[];
        top10ByTopic: Record<string, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[]>;
        global: z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[];
        stability: {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        };
    }>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"top10">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        nextRefreshAt: z.ZodString;
        topicsCovered: z.ZodArray<z.ZodString, "many">;
        top10ByTopic: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        global: z.ZodArray<z.ZodObject<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        stability: z.ZodObject<{
            carriedOver: z.ZodNumber;
            fresh: z.ZodNumber;
            churnRate: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        }, {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        nextRefreshAt: string;
        topicsCovered: string[];
        top10ByTopic: Record<string, z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[]>;
        global: z.objectOutputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[];
        stability: {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        };
    }, {
        nextRefreshAt: string;
        topicsCovered: string[];
        top10ByTopic: Record<string, z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[]>;
        global: z.objectInputType<{
            rank: z.ZodNumber;
            clusterId: z.ZodString;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            score: z.ZodObject<{
                interaction: z.ZodNumber;
                credibility: z.ZodNumber;
                recency: z.ZodNumber;
                diversity: z.ZodNumber;
                corroboration: z.ZodNumber;
                total: z.ZodNumber;
                weights: z.ZodRecord<z.ZodString, z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }, {
                interaction: number;
                credibility: number;
                recency: number;
                diversity: number;
                corroboration: number;
                total: number;
                weights: Record<string, number>;
            }>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            delta: z.ZodObject<{
                previousRank: z.ZodNullable<z.ZodNumber>;
                movement: z.ZodEnum<["new", "up", "down", "same"]>;
            }, "strip", z.ZodTypeAny, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }, {
                previousRank: number | null;
                movement: "new" | "up" | "down" | "same";
            }>;
            carriedOver: z.ZodBoolean;
        }, z.ZodTypeAny, "passthrough">[];
        stability: {
            carriedOver: number;
            fresh: number;
            churnRate: number;
        };
    }>;
}, z.ZodTypeAny, "passthrough">>;
export type Top10ArtifactInput = z.input<typeof Top10ArtifactSchema>;
export declare const ArticleArtifactSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"articles">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        articles: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        copyrightPolicy: z.ZodObject<{
            originalTextOnly: z.ZodLiteral<true>;
            maxQuoteWords: z.ZodNumber;
            reproduceArticleBody: z.ZodLiteral<false>;
            requireAttribution: z.ZodLiteral<true>;
            requireCanonicalLinks: z.ZodLiteral<true>;
        }, "strip", z.ZodTypeAny, {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        }, {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        }>;
    }, "strip", z.ZodTypeAny, {
        articles: z.objectOutputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        copyrightPolicy: {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        };
    }, {
        articles: z.objectInputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        copyrightPolicy: {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        };
    }>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"articles">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        articles: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        copyrightPolicy: z.ZodObject<{
            originalTextOnly: z.ZodLiteral<true>;
            maxQuoteWords: z.ZodNumber;
            reproduceArticleBody: z.ZodLiteral<false>;
            requireAttribution: z.ZodLiteral<true>;
            requireCanonicalLinks: z.ZodLiteral<true>;
        }, "strip", z.ZodTypeAny, {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        }, {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        }>;
    }, "strip", z.ZodTypeAny, {
        articles: z.objectOutputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        copyrightPolicy: {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        };
    }, {
        articles: z.objectInputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        copyrightPolicy: {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        };
    }>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    schemaVersion: z.ZodLiteral<"ardur-content-pipeline/v1">;
    contractRevision: z.ZodOptional<z.ZodNumber>;
    artifact: z.ZodLiteral<"articles">;
    runId: z.ZodString;
    upstreamRunId: z.ZodNullable<z.ZodString>;
    generatedAt: z.ZodString;
    cycle: z.ZodObject<{
        id: z.ZodString;
        windowStart: z.ZodString;
        windowEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }, {
        id: string;
        windowStart: string;
        windowEnd: string;
    }>;
    topics: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        description: string;
    }, {
        id: string;
        label: string;
        description: string;
    }>, "many">;
    provider: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
        model: z.ZodString;
        status: z.ZodEnum<["generated", "fallback"]>;
        reason: z.ZodOptional<z.ZodString>;
        generatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }, {
        generatedAt: string;
        provider: "deterministic" | "ollama" | "openai";
        status: "generated" | "fallback";
        model: string;
        reason?: string | undefined;
    }>>;
    warnings: z.ZodArray<z.ZodString, "many">;
    data: z.ZodObject<{
        articles: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        copyrightPolicy: z.ZodObject<{
            originalTextOnly: z.ZodLiteral<true>;
            maxQuoteWords: z.ZodNumber;
            reproduceArticleBody: z.ZodLiteral<false>;
            requireAttribution: z.ZodLiteral<true>;
            requireCanonicalLinks: z.ZodLiteral<true>;
        }, "strip", z.ZodTypeAny, {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        }, {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        }>;
    }, "strip", z.ZodTypeAny, {
        articles: z.objectOutputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        copyrightPolicy: {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        };
    }, {
        articles: z.objectInputType<{
            id: z.ZodString;
            rank: z.ZodNumber;
            topic: z.ZodString;
            topicLabel: z.ZodString;
            headline: z.ZodString;
            dek: z.ZodString;
            body: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                type: z.ZodEnum<["paragraph", "heading", "list", "quote", "callout"]>;
                text: z.ZodOptional<z.ZodString>;
                items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                attribution: z.ZodOptional<z.ZodObject<{
                    source: z.ZodString;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    source: string;
                    url: string;
                }, {
                    source: string;
                    url: string;
                }>>;
            }, z.ZodTypeAny, "passthrough">>, "many">;
            keyPoints: z.ZodArray<z.ZodString, "many">;
            whyItMatters: z.ZodString;
            readerAction: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            sourceQuality: z.ZodEnum<["corroborated", "multi-source", "single trusted source", "single source"]>;
            references: z.ZodArray<z.ZodObject<{
                source: z.ZodString;
                sourceDomain: z.ZodString;
                tier: z.ZodEnum<["primary", "paper", "news", "technical-news", "security-news"]>;
                url: z.ZodString;
                title: z.ZodString;
                publishedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }, {
                title: string;
                source: string;
                sourceDomain: string;
                url: string;
                tier: "primary" | "paper" | "news" | "technical-news" | "security-news";
                publishedAt: string;
            }>, "many">;
            provenance: z.ZodObject<{
                clusterId: z.ZodString;
                sourceCount: z.ZodNumber;
                distinctDomains: z.ZodNumber;
                upstreamRunId: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }, {
                upstreamRunId: string;
                clusterId: string;
                sourceCount: number;
                distinctDomains: number;
            }>;
            ai: z.ZodObject<{
                provider: z.ZodEnum<["deterministic", "ollama", "openai"]>;
                model: z.ZodString;
                status: z.ZodEnum<["generated", "fallback"]>;
                reason: z.ZodOptional<z.ZodString>;
                generatedAt: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }, {
                generatedAt: string;
                provider: "deterministic" | "ollama" | "openai";
                status: "generated" | "fallback";
                model: string;
                reason?: string | undefined;
            }>;
            legalNote: z.ZodString;
            wordCount: z.ZodNumber;
            readingTimeMinutes: z.ZodNumber;
            generatedAt: z.ZodString;
        }, z.ZodTypeAny, "passthrough">[];
        copyrightPolicy: {
            originalTextOnly: true;
            maxQuoteWords: number;
            reproduceArticleBody: false;
            requireAttribution: true;
            requireCanonicalLinks: true;
        };
    }>;
}, z.ZodTypeAny, "passthrough">>;
export type ArticleArtifactInput = z.input<typeof ArticleArtifactSchema>;
