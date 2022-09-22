import { test } from "uvu";
import { equal, unreachable, instance, match } from "uvu/assert";
import { Octokit } from "@octoherd/cli";
import { script } from "./script.js";
import nock from "nock";
import { repository } from "./fixtures/repository-example.js";

const getOctokitForTests = () => {
  return new Octokit({
    retry: { enabled: false },
    throttle: { enabled: false },
  });
};

test.before(() => {
  nock.disableNetConnect();
});

test.before.each(() => {
  nock.cleanAll();
});

test.after(() => {
  nock.restore();
});

test("throws if --action-name option is not provided", async () => {
  try {
    // @ts-expect-error
    await script(getOctokitForTests(), repository, { actionVersion: "v3" });
    unreachable("should have thrown");
  } catch (err) {
    instance(err, Error);
    match(err.message, "--action-name is required");
  }
});

test("throws if --action-version option is not provided", async () => {
  try {
    // @ts-expect-error
    await script(getOctokitForTests(), repository, {
      actionName: "action-name",
    });
    unreachable("should have thrown");
  } catch (err) {
    instance(err, Error);
    match(err.message, "--action-version is required");
  }
});

test("returns if repository is archived", async () => {
  const respositoryArchived = { ...repository, archived: true };

  try {
    await script(getOctokitForTests(), respositoryArchived, {
      actionName: "action-name",
      actionVersion: "v3",
    });
  } catch (error) {
    unreachable(`should have NOT thrown: ${error}`);
  }

  equal(nock.pendingMocks().length, 0);
});

test.run();
