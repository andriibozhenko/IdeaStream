"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  text: z.string().min(3, "Idea must be at least 3 characters.").max(280, "Idea cannot exceed 280 characters."),
});

interface IdeaFormProps {
  user: UserProfile;
  postIdeaAction: (formData: { text: string }, user: UserProfile) => Promise<void>;
}

export function IdeaForm({ user, postIdeaAction }: IdeaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // The parent component now handles closing the dialog and showing notifications
    await postIdeaAction(values, user);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Share your idea for the day..."
                  {...field}
                  rows={4}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Idea"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
