import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";

const meta = {
    title: "Design System/Base Components/Form",
    component: Form,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-md">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default form — a single input and a Nimbus submit button. */
export const Default: Story = {
    render: () => (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className="flex flex-col gap-4"
        >
            <Input name="email" type="email" label="Email" placeholder="olivia@untitledui.com" isRequired />
            <Button type="submit">Submit</Button>
        </Form>
    ),
};

/** Sign-in form with multiple fields. */
export const SignIn: Story = {
    render: () => (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className="flex flex-col gap-4"
        >
            <Input name="email" type="email" label="Email" placeholder="olivia@untitledui.com" isRequired />
            <Input name="password" type="password" label="Password" placeholder="Enter your password" isRequired />
            <Button type="submit" size="lg">
                Sign in
            </Button>
        </Form>
    ),
};

/** Native form validation — the required field blocks submission until filled. */
export const WithValidation: Story = {
    render: () => (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            className="flex flex-col gap-4"
        >
            <Input name="username" label="Username" placeholder="Choose a username" isRequired hint="This field is required." />
            <div className="flex gap-3">
                <Button type="reset" color="secondary">
                    Reset
                </Button>
                <Button type="submit">Create account</Button>
            </div>
        </Form>
    ),
};
