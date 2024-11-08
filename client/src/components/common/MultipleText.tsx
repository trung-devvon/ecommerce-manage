import React from "react";
import { X, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
interface FormFields {
  keywords: string[];
}

interface MultipleTextProps {
  form: UseFormReturn<FormFields>;
}

const MultipleText = ({ form }: any) => {
  const [inputValue, setInputValue] = React.useState("");

  const addKeyWord = () => {
    const currentKeywords: string[] = form.getValues("keywords") || [];
      const cleanedInput = inputValue.trim();
      if (
        cleanedInput &&
        !currentKeywords.some((keyword) => keyword.includes(cleanedInput)) &&
        currentKeywords.length < 14
      ) {
        form.setValue("keywords", [...currentKeywords, cleanedInput]);
      }
      setInputValue("");
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyWord()
    }
  };

  const removeKeyword = (indexToRemove: any) => {
    const currentKeywords: string[] = form.getValues("keywords") || [];
    form.setValue(
      "keywords",
      currentKeywords.filter((_, index) => index !== indexToRemove)
    );
  };
  const clearAllKeywords = () => {
    form.setValue("keywords", []);
  };

  return (
    <FormField
      control={form.control}
      name="keywords"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Từ khoá cho sản phẩm của bạn</FormLabel>
          <div className="space-y-2">
            <FormControl>
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập từ khóa và nhấn Enter"
                disabled={field.value?.length >= 14}
              />
            </FormControl>
            {inputValue && <div className="flex-center gap-2 bg-orange-200 text-orange-700 border border-orange-300 rounded-lg py-2">
                <span>{inputValue}</span>
                <PlusCircle className="size-4 cursor-pointer" onClick={addKeyWord} />
            </div>}
            <div className="flex flex-wrap gap-2">
              {field.value?.map((keyword: string, index: any) => (
                <div
                  key={`${keyword + index}`}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
                >
                  <span>{keyword}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-blue-200"
                    onClick={() => removeKeyword(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {field.value?.length >= 14 && (
              <p className="text-xs text-orange-500">
                Đã đạt giới hạn tối đa 14 từ khóa
              </p>
            )}
            {field.value?.length > 0 && (
              <Button
                type="button"
                size={'sm'}
                variant="outline"
                className="mt-2 gap-1 flex items-center text-red-600"
                onClick={clearAllKeywords}
              >
                <Trash2 size={13} />
                <span className="text-xs">xoá tất cả</span>
              </Button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MultipleText;
