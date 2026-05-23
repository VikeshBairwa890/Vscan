import { useState } from "react";

import TemplatePicker from "@/components/website-builder/TemplatePicker";

import TemplateRenderer from "@/components/website-builder/TemplateRenderer";

import { DEFAULT } from "@/components/website-builder/defaultData";

export default function Builder() {

  const [selected, setSelected] =  useState("modern");

  return (
    <div className="min-h-screen bg-zinc-100 p-6">

      <TemplatePicker
        selected={selected}
        onSelect={setSelected}
      />

      <TemplateRenderer
        templateId={selected}
        data={DEFAULT}
      />

    </div>
  );
}