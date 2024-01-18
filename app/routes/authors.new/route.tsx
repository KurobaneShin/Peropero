import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { FormControl } from "~/components/custom/FormControl";
import { InputWithLabel } from "~/components/custom/inputWithLabel";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { supabase } from "~/infra/supabase";
import { makeForm } from "~/lib/makeForm";

const { parse } = makeForm(
  z.object({
    name: z.string().min(1),
  })
);

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const { data, errors } = parse(formData);

  if (errors) return { errors };

  const { name } = data;

  await supabase.from("authors").insert({
    name,
  });
  return redirect("/new");
};

export default function New() {
  const data = useActionData<typeof action>();
  console.log(data);

  return (
    <Form method="post">
      <FormControl name="name" label="Nome">
        <Input name="name" autoFocus />
      </FormControl>
      <Button type="submit">Enviar</Button>
    </Form>
  );
}
