// test/security_audit.js
// Automated Cybersecurity Verification Suite for FlavorCraft Platform

const assert = require("assert");
const http = require("http");

// Start server on a test port
process.env.PORT = "5055";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_super_secure_secret_key_for_automated_testing_123456789";

const app = require("../server");

// Helper to make HTTP requests
function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "127.0.0.1",
      port: 5055,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runSecurityTests() {
  console.log("🔒 Starting FlavorCraft Cybersecurity Audit Verification...\n");

  let passed = 0;
  let failed = 0;

  function report(name, condition) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // 1. Security Headers Verification
    console.log("--- 1. HTTP Security Headers (Helmet) ---");
    const rootRes = await request("GET", "/");
    report("X-Content-Type-Options: nosniff is present", rootRes.headers["x-content-type-options"] === "nosniff");
    report("X-Frame-Options: DENY is present", rootRes.headers["x-frame-options"] === "DENY");
    report("X-Powered-By is hidden", !rootRes.headers["x-powered-by"]);
    report("Content-Security-Policy is present", Boolean(rootRes.headers["content-security-policy"]));

    // 2. Privilege Escalation Prevention
    console.log("\n--- 2. Privilege Escalation & Auth Security ---");
    const regPayload = {
      name: "Hacker User",
      email: `hacker_${Date.now()}@exploit.com`,
      password: "StrongPassword123!",
      role: "admin" // Attempting privilege escalation
    };
    const regRes = await request("POST", "/api/users/register", {}, regPayload);
    report("Registration succeeded with 201", regRes.status === 201);
    report("Role is forced to 'user' (admin injection blocked)", regRes.data.user && regRes.data.user.role === "user");

    const hackerToken = regRes.data.token;

    // 3. User Enumeration Protection
    console.log("\n--- 3. User Enumeration & Data Scraping Protection ---");
    const publicUsersRes = await request("GET", "/api/users");
    report("Public GET /api/users is blocked (401)", publicUsersRes.status === 401);

    const normalUserListRes = await request("GET", "/api/users", { Authorization: `Bearer ${hackerToken}` });
    report("Non-admin user cannot list all users (403)", normalUserListRes.status === 403);

    // 4. Broken Object Level Authorization (BOLA / IDOR)
    console.log("\n--- 4. Broken Object-Level Authorization (BOLA / IDOR) ---");
    // Register legitimate chef
    const chefPayload = {
      name: "Chef Ashley",
      email: `chef_${Date.now()}@kitchen.com`,
      password: "ChefPassword456!"
    };
    const chefRes = await request("POST", "/api/users/register", {}, chefPayload);
    const chefToken = chefRes.data.token;

    // Chef creates recipe
    const newRecipePayload = {
      title: "Authentic Harare Stew",
      description: "Traditional savory beef stew with greens and tomatoes.",
      ingredients: ["Beef", "Tomatoes", "Onions", "Leafy Greens"],
      instructions: "Simmer beef until tender, mix in fresh vegetables.",
      category: "Zimbabwean",
      difficulty: "Medium",
      preparationTime: 45
    };
    const recipeCreateRes = await request("POST", "/api/recipes", { Authorization: `Bearer ${chefToken}` }, newRecipePayload);
    report("Legitimate recipe created (201)", recipeCreateRes.status === 201);
    const recipeId = recipeCreateRes.data.recipe._id;

    // Hacker tries to delete Chef's recipe
    const unauthorizedDelete = await request("DELETE", `/api/recipes/${recipeId}`, { Authorization: `Bearer ${hackerToken}` });
    report("Unauthorized user cannot delete another's recipe (403 Forbidden)", unauthorizedDelete.status === 403);

    // Hacker tries to modify Chef's recipe
    const unauthorizedUpdate = await request("PUT", `/api/recipes/${recipeId}`, { Authorization: `Bearer ${hackerToken}` }, {
      title: "Defaced Recipe by Attacker"
    });
    report("Unauthorized user cannot modify another's recipe (403 Forbidden)", unauthorizedUpdate.status === 403);

    // 5. Category Protection (Admin RBAC)
    console.log("\n--- 5. Category Management RBAC ---");
    const unauthCategoryCreate = await request("POST", "/api/categories", {}, { name: "Malicious Category" });
    report("Unauthenticated category creation blocked (401)", unauthCategoryCreate.status === 401);

    const nonAdminCategoryCreate = await request("POST", "/api/categories", { Authorization: `Bearer ${hackerToken}` }, { name: "Malicious Category" });
    report("Non-admin category creation blocked (403)", nonAdminCategoryCreate.status === 403);

    // 6. Input Validation & Password Policy
    console.log("\n--- 6. Input Validation & Weak Password Defense ---");
    const weakPassRes = await request("POST", "/api/users/register", {}, {
      name: "Weak Pass User",
      email: `weak_${Date.now()}@test.com`,
      password: "123" // Too short
    });
    report("Weak password rejected (400)", weakPassRes.status === 400);

    const invalidEmailRes = await request("POST", "/api/users/register", {}, {
      name: "Bad Email User",
      email: "not-an-email",
      password: "ValidPassword123!"
    });
    report("Invalid email rejected (400)", invalidEmailRes.status === 400);

    // 7. ReDoS & Regex Injection Defense
    console.log("\n--- 7. ReDoS & Regex Injection Protection ---");
    const regexPayload = "(((((((a+)+)+)+)+)+)+)$";
    const searchRes = await request("GET", `/api/recipes?search=${encodeURIComponent(regexPayload)}`);
    report("ReDoS payload safely handled without crashing (200)", searchRes.status === 200);

    console.log("\n==================================================");
    console.log(`Cybersecurity Audit Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

// Allow server to initialize before running tests
setTimeout(runSecurityTests, 2000);
