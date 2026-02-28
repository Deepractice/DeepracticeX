import * as Gherkin from "@cucumber/gherkin";
import * as messages from "@cucumber/messages";
import { readFileSync } from "node:fs";

export interface ParsedFeature {
  document: messages.GherkinDocument;
  pickles: messages.Pickle[];
}

export function parseFeatureFile(filePath: string): ParsedFeature {
  const source = readFileSync(filePath, "utf-8");
  return parseFeatureSource(source, filePath);
}

export function parseFeatureSource(
  source: string,
  uri: string
): ParsedFeature {
  const newId = messages.IdGenerator.uuid();

  const envelopes = Gherkin.generateMessages(
    source,
    uri,
    messages.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
    {
      newId,
      includeSource: false,
      includeGherkinDocument: true,
      includePickles: true,
    }
  );

  let document: messages.GherkinDocument | undefined;
  const pickles: messages.Pickle[] = [];
  const errors: messages.ParseError[] = [];

  for (const envelope of envelopes) {
    if (envelope.gherkinDocument) {
      document = envelope.gherkinDocument;
    }
    if (envelope.pickle) {
      pickles.push(envelope.pickle);
    }
    if (envelope.parseError) {
      errors.push(envelope.parseError);
    }
  }

  if (errors.length > 0) {
    const msg = errors
      .map(
        (e) =>
          `${uri}:${e.source?.location?.line ?? "?"} - ${e.message}`
      )
      .join("\n");
    throw new Error(`Gherkin parse error:\n${msg}`);
  }

  if (!document) {
    throw new Error(`No gherkin document found in ${uri}`);
  }

  return { document, pickles };
}
