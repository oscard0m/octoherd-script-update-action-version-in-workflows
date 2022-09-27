import { test } from "uvu";
import { equal } from "uvu/assert";
import { replaceActionVersionInWorkflow } from "./utils.js";
import { readFile } from "fs/promises";

test("updates the file if contains the corresponding github action", async () => {
  const fileContent = await readFile(
    "./fixtures/workflow-files/example1/input.yml",
    "utf8"
  );

  let updatedFileContent = replaceActionVersionInWorkflow(
    "actions/setup-node",
    "v3"
  )({ content: fileContent, exists: true });

  equal(
    updatedFileContent,
    await readFile("./fixtures/workflow-files/example1/output.yml", "utf8")
  );
});

test("updates all the occurrences of the corresponding github action", async () => {
  const fileContent = await readFile(
    "./fixtures/workflow-files/example2/input.yml",
    "utf8"
  );

  let updatedFileContent = replaceActionVersionInWorkflow(
    "actions/setup-node",
    "v3"
  )({ content: fileContent, exists: true });

  equal(
    updatedFileContent,
    await readFile("./fixtures/workflow-files/example2/output.yml", "utf8")
  );
});

test("preserves the content of the file if the action already has the version applied", async () => {
  const fileContent = await readFile(
    "./fixtures/workflow-files/example3/input.yml",
    "utf8"
  );

  let updatedFileContent = replaceActionVersionInWorkflow(
    "actions/setup-node",
    "v3"
  )({ content: fileContent, exists: true });

  equal(updatedFileContent, fileContent);
});

test("preserves the content of the file WITH COMMENTS if the action is updated", async () => {
  const fileContent = await readFile(
    "./fixtures/workflow-files/example4/input.yml",
    "utf8"
  );

  let updatedFileContent = replaceActionVersionInWorkflow(
    "actions/setup-node",
    "v3"
  )({ content: fileContent, exists: true });

  equal(
    updatedFileContent,
    await readFile("./fixtures/workflow-files/example4/output.yml", "utf8")
  );
});

test.run();
