# Dockerfile

# ---- Base Stage ----
# Use the official Node.js 20 image as a base.
# The 'alpine' version is smaller and more secure.
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm - a fast, disk space efficient package manager.
# You can replace this with npm or yarn if you prefer.
RUN npm install -g pnpm


# ---- Dependencies Stage ----
# This stage is dedicated to installing dependencies.
# It's a separate stage to leverage Docker's layer caching.
# Dependencies don't change as often as source code, so this layer won't
# be rebuilt unless package.json or pnpm-lock.yaml changes.
FROM base AS deps
WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install 


# ---- Builder Stage ----
# This stage builds the Next.js application.
FROM base AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of your application source code
COPY . .

# Build the Next.js application for production
RUN pnpm build


# ---- Runner Stage (Final Production Image) ----
# This is the final stage that will run the application.
# It starts from a clean base to keep the image size minimal.
FROM base AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production
# The Next.js app will run on port 3000 by default.
ENV PORT=3000

# Automatically create a non-root user for security purposes
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public directory from the builder stage
COPY --from=builder /app/public ./public

# Copy the standalone Next.js server output.
# This is a self-contained folder that doesn't need node_modules.
# Ensure `output: 'standalone'` is set in your next.config.js for this to work.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# The command to start the application
CMD ["node", "server.js"]