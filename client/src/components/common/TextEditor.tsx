import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller, Control } from "react-hook-form";

interface TextEditorProps {
  name: string;
  control: Control<any>;
  defaultValue?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  name,
  control,
  defaultValue = "",
}) => {
  const editorConfig = {
    height: 350,
    width: "100%",
    menubar: true,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
      "codesample",
    ],
    toolbar:
      "undo redo | blocks | " +
      "bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | codesample code | help",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  };

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={import.meta.env.VITE_TINY_API_KEY}
            initialValue={defaultValue}
            value={value}
            onEditorChange={(content) => {
              onChange(content);
            }}
            init={editorConfig}
          />
        )}
      />
    </div>
  );
};

export default TextEditor;
