/**
 * Server-rendered JSON-LD <script>.
 *
 * Use inside any server component / page.tsx to emit a schema.org graph.
 * The data is stringified with no extra whitespace to keep payloads small,
 * and rendered with dangerouslySetInnerHTML so Next.js does not turn the
 * inline JSON into React text nodes.
 *
 * Example:
 *   <JsonLd data={speciesPageJsonLd({ entry, tldr, faqs, images })} />
 */

interface JsonLdProps {
  data: unknown;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
