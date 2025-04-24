"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

interface ContactInfoProp {
  icon: ReactElement;
  title: string;
  description: string;
}

const info: ContactInfoProp[] = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "(+45) 29 88 03 79",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "willyjensen251@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: "Storkevej 20, 7741 Frøstrup, Denmark",
  },
];

import { motion } from "framer-motion";
import { ReactElement, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";

import { z } from "zod";

const ContactSchema = z.object({
  firstname: z.string().min(2, {
    message: "Firstname must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Lastname must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z
    .string()
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    })
    .min(8, {
      message: "Phone number must be at least 8 digits.",
    }),
  service: z.string().nonempty({
    message: "Please select a service.",
  }),
  description: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const ErrorMessage = ({ message }: { message?: string }) => {
    return message ? <p className="text-red-500 text-sm">{message}</p> : null;
  };

  const formRef = useRef<HTMLFormElement | null>(null);

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      service: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof ContactSchema>) => {
    setIsLoading(true);
    console.log(data);

    if (formRef.current) {
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          formRef.current,
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
          }
        )
        .then(
          () => {
            form.reset();
            setIsLoading(false);
            toast("Email sent successfully!");
          },
          (error) => {
            console.error("Email sending failed:", error);
            setIsLoading(false);
            toast.error("Failed to send email. Please try again later.");
          }
        );
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          {/* form */}
          <div className="xl:h-[54%] order-2 xl:order-none">
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 p-10 bg-[#27272c] rounded-xl"
            >
              <h3 className="text-4xl text-accent-default ">
                Let&apos;s work together
              </h3>
              <p className="text-white/60">
                Have a project in mind? Let’s collaborate to turn your vision
                into reality. Reach out today, and we’ll guide you every step of
                the way.
              </p>
              {/* input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Input
                    {...form.register("firstname")}
                    name="firstname"
                    placeholder="Frstname"
                    aria-label="Firstname"
                  />
                  <ErrorMessage
                    message={form.formState.errors.firstname?.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    {...form.register("lastname")}
                    name="lastname"
                    placeholder="Lastname"
                    aria-label="Lastname"
                  />
                  <ErrorMessage
                    message={form.formState.errors.lastname?.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    {...form.register("email")}
                    name="email"
                    type="email"
                    placeholder="Email address"
                    aria-label="Email"
                  />
                  <ErrorMessage
                    message={form.formState.errors.email?.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Input
                    {...form.register("phone")}
                    name="phone"
                    placeholder="Phone number"
                    aria-label="Phone"
                  />
                  <ErrorMessage
                    message={form.formState.errors.phone?.message}
                  />
                </div>
              </div>
              {/* select */}
              <Select
                name="service"
                onValueChange={(value) => form.setValue("service", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select a service</SelectLabel>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Logo Design">Logo Design</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage message={form.formState.errors.service?.message} />

              {/* textarea */}
              <Textarea
                {...form.register("description")}
                className="h-[200px]"
                name="description"
                placeholder="Type your message here."
              />
              <ErrorMessage
                message={form.formState.errors.description?.message}
              />

              {/* btn */}
              <Button
                type="submit"
                size="md"
                className="max-w-40 hover:cursor-pointer "
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    Sending
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [-5, 0, -5] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0,
                      }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [-5, 0, -5] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                    >
                      .
                    </motion.span>
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [-5, 0, -5] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4,
                      }}
                    >
                      .
                    </motion.span>
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
          {/* info */}
          <div className="flex-1 flex items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => {
                return (
                  <li key={index} className="flex items-center gap-6">
                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent-default rounded-md flex items-center justify-center">
                      <div className="text-[28px]"> {item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60"> {item.title}</p>
                      <h3 className="text-xl">{item.description}</h3>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
