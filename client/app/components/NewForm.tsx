"use client";

// for testing
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/components/ui/form";

import { Input } from "@app/components/ui/input";

const NewForm = () => {
  const form = useForm();
  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      test: [{ firstName: "Bill", lastName: "Luo" }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({
      control,
      name: "test",
    });

  const onSubmit = (data: any) => console.log("newform data", data);
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Field Array </h1>
        <p>The following demo allow you to delete, append, prepend items</p>

        <ul>
          {fields.map((item, index) => {
            return (
              <FormField
                key={item.id}
                control={control}
                name={`test.${index}`}
                render={() => (
                  <li>
                    {" "}
                    <FormItem>
                      <FormControl>
                        <Input {...register(`test.${index}.firstName`)} />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <Input {...register(`test.${index}.lastName`)} />
                      </FormControl>
                    </FormItem>
                    <button
                      type="button"
                      onClick={() => {
                        console.log("click", index);
                        remove(index);
                      }}
                    >
                      Delete{index}
                    </button>
                  </li>
                )}
              />
            );
          })}
        </ul>

        <section>
          <button
            type="button"
            onClick={() => {
              append({ firstName: "appendBill", lastName: "appendLuo" });
            }}
          >
            append
          </button>
        </section>

        <input type="submit" />
      </form>
    </Form>
  );
};

export default NewForm;
