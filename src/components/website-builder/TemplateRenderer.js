import { templates } from "./registry";

export default function TemplateRenderer({
  templateId,
  data,
}) {

  const selected =
    templates.find(
      (t) => t.id === templateId
    );

  if (!selected) {
    return (
      <div className="p-4 text-sm text-red-500">
        Template not found
      </div>
    );
  }

  const Component =
    selected.component;

  return (
    <Component data={data} />
  );
}