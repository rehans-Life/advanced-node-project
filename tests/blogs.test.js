const Page = require("./helpers/page");

describe("Blogs functionality works", () => {
  let page;

  beforeEach(async () => {
    page = await Page.build();
    await page.goto("http://localhost:3000");
  });

  afterEach(async () => {
    await page.close();
  });

  describe("When logged in", async () => {
    beforeEach(async () => {
      await page.login();
      await page.click("a.btn-floating");
    });

    test("can see blog create form", async () => {
      const label = await page.getContentsOf("form label");
      expect(label).toEqual("Blog Title");
    });

    describe("And submitting with valid inouts", () => {
      const blogTitle = "Blog Title";
      const blogContent = "Blog Content";

      beforeEach(async () => {
        await page.type("input[name='title']", blogTitle);
        await page.type("input[name='content']", blogContent);
        await page.click("button[type='submit']");
      });

      test("submitting takes user to review screen", async () => {
        const text = await page.getContentsOf("form h5");
        expect(text).toEqual("Please confirm your entries");
      });

      test("submitting then saving adds blog to the index page", async () => {
        await page.click("button.green");
        await page.waitFor(".card");

        const title = await page.getContentsOf(".card-title");
        const content = await page.getContentsOf(".card-content p");

        expect(title).toEqual(blogTitle);
        expect(content).toEqual(blogContent);
      });
    });

    describe("And submitting with invalid inputs", () => {
      beforeEach(async () => {
        await page.click("button[type='submit']");
      });

      test("form displays an error message", async () => {
        const titleErrorMsg = await page.getContentsOf(".title .red-text");
        const contentErrorMsg = await page.getContentsOf(".content .red-text");

        const errorMsg = "You must provide a value";

        expect(titleErrorMsg).toEqual(errorMsg);
        expect(contentErrorMsg).toEqual(errorMsg);
      });
    });
  });

  describe("When not logged in", () => {
    const actions = [
      {
        method: "get",
        path: "/api/blogs",
      },
      {
        method: "post",
        path: "/api/blogs",
        body: {
          title: "Hello",
          content: "Content",
        },
      },
    ];

    test("blog related actions are prohibited", async () => {
      const responses = await page.execActions(actions);

      responses.forEach((res) => {
        expect(res).toEqual({ error: "You must log in!" });
      });
    });
  });
});
