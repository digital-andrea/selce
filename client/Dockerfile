FROM denoland/deno:alpine-2.3.1

# The dev server's port
EXPOSE 4321

# Working directory within the container
WORKDIR /app

# Copy files over
COPY ./package.json .
COPY ./deno.lock .
RUN deno install --allow-scripts
COPY . .

ENV ASTRO_TELEMETRY_DISABLED=1

RUN deno install --allow-scripts

CMD ["task", "astro", "dev", "--host", "0.0.0.0"]
