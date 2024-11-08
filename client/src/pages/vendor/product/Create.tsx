import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { loginAPI } from "@/api/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginResponse } from "@/interfaces/auth";
import { useLoading } from "@/LoadingContext";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/common/TextEditor";
import { Editor } from "@tinymce/tinymce-react";
import { getAllCategoryAPI, getAllCategoryShopAPI } from "@/api/category";
import MultipleText from "@/components/common/MultipleText";
import { locationShop } from "@/utils/data";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Tên sản phẩm quá ngắn" })
    .max(200, { message: "Tên sản phẩm quá dài" }),
  category: z
    .string({ required_error: "Vui lòng chọn danh mục" })
    .min(1, { message: "Vui lòng chọn danh mục sản phẩm" }),
  description: z
    .string({ required_error: "Không được bỏ trống mô tả" })
    .min(1, { message: "Vui lòng Viết mô tả cho sản phẩm của bạn" }),
  keywords: z.array(z.string()).max(14, "Tối đa 14 từ khóa").default([]),
  location: z
    .string({ required_error: "Vui lòng chọn nơi bán" })
    .min(1, { message: "Vui lòng chọn địa điểm cửa hàng của bạn" }),
});

const Create = () => {
  const [enabled, setEnabled] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      keywords: [],
      location: "",
    },
  });

  const { current } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (current?.shopId) {
      setEnabled(true);
    }
  }, [current?.shopId]);
  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoading();

  const { data } = useQuery({
    queryKey: ["categories-shop"],
    queryFn: () => getAllCategoryShopAPI(current?.shopId),
    enabled: enabled,
    retry: 3,
  });

  const mutation = useMutation<LoginResponse, any, FieldValues>({
    mutationFn: loginAPI,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {},
    onError: (error) => {},
    onSettled: () => {
      setIsLoading(false);
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // mutation.mutate(values);
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border rounded-lg p-2 w-full mx-auto"
      >
        <h2 className="font-semibold text-2xl text-center">
          Đăng nhập tài khoản
        </h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="Nhập vào tên sản phẩm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Thuộc loại danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data && data.length > 0 ? (
                        data?.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <option disabled>Chưa có dữ liệu</option>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí cửa hàng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vị trí cửa hàng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationShop ? (
                        locationShop?.map((item: any) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.province}
                          </SelectItem>
                        ))
                      ) : (
                        <option disabled>Chưa có dữ liệu</option>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="basis-1/3 rounded-md shadow">
            <MultipleText form={form} />
          </div>
          <div className="basis-2/3"></div>
        </div>
        <div className="flex w-full">
          <FormField
            control={form.control}
            name="description"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Mô tả sản phẩm</FormLabel>
                <FormControl>
                  <TextEditor name="description" control={form.control} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Đăng bán sản phẩm</Button>
      </form>
    </Form>
  );
};

export default Create;
