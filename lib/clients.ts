import { request } from "@octokit/request";
import { Vercel } from "@vercel/sdk";
import assert from "node:assert";

assert(process.env.GITHUB_API_TOKEN, "GITHUB_API_TOKEN env var is required");
assert(process.env.VERCEL_API_TOKEN, "VERCEL_API_TOKEN env var is required");

export const githubReq = request.defaults({
  headers: { authorization: `token ${process.env.GITHUB_API_TOKEN}` },
});

export const vercel = new Vercel({ bearerToken: process.env.VERCEL_API_TOKEN });

export const vercelToken = process.env.VERCEL_API_TOKEN;
