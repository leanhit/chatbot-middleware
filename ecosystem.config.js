module.exports = {
  apps: [
    {
      name: "frontend-dev",
      cwd: "./frontend",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "backend-dev",
      cwd: "./backend",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
