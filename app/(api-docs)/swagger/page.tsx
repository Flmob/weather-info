import { getApiDocs } from "@/lib";

import ReactSwagger from "./react-swagger";

export default async function ApiDoc() {
  const spec = await getApiDocs();
  return (
    <section className="container bg-green-400 p-4 rounded-lg border border-green-400/20">
      <ReactSwagger spec={spec} />
    </section>
  );
}
