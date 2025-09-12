#!/bin/bash
pnpm --filter @zoroaster/backend build && \
pnpm --filter @zoroaster/shared build && \
pnpm --filter @zoroaster/ui build && \
cd apps/frontend && pnpm build