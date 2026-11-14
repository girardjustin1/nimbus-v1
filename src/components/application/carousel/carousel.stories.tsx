import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, ArrowRight } from "@untitledui/icons";
import { Carousel } from "@/components/application/carousel/carousel-base";

/**
 * Application UI → Carousel
 *
 * Embla-based carousel composed from the Nimbus `Carousel` compound components
 * (`Root`, `Content`, `Item`, `PrevTrigger`, `NextTrigger`, `IndicatorGroup`,
 * `Indicator`). Triggers and indicators pick up the Nimbus brand color.
 */

const slides = [
    { title: "Discover", description: "Explore what Nimbus can do for your team.", className: "bg-utility-brand-600" },
    { title: "Build", description: "Compose interfaces with accessible primitives.", className: "bg-utility-brand-500" },
    { title: "Ship", description: "Deploy with confidence across light and dark modes.", className: "bg-utility-brand-700" },
    { title: "Scale", description: "Grow without rewriting your design system.", className: "bg-utility-brand-800" },
    { title: "Delight", description: "Give your users a polished, cohesive experience.", className: "bg-utility-brand-900" },
];

const meta = {
    title: "Design System/Application UI/Carousel",
    component: Carousel.Root,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof Carousel.Root>;

export default meta;

type Story = StoryObj<typeof Carousel.Root>;

export const Default: Story = {
    render: () => (
        <div className="h-80 w-full max-w-3xl">
            <Carousel.Root className="flex h-full flex-col gap-4" opts={{ loop: true }}>
                <div className="relative flex-1">
                    <Carousel.Content className="h-full">
                        {slides.map((slide) => (
                            <Carousel.Item key={slide.title}>
                                <div className={`flex h-full flex-col items-start justify-end gap-1 rounded-2xl p-8 text-white ${slide.className}`}>
                                    <p className="text-xl font-semibold">{slide.title}</p>
                                    <p className="text-sm text-white/80">{slide.description}</p>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel.Content>

                    <Carousel.PrevTrigger
                        className={({ isDisabled }) =>
                            `absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-lg ring-1 ring-border-secondary transition duration-100 ease-linear ${isDisabled ? "opacity-50" : "hover:bg-primary_hover"}`
                        }
                    >
                        <ArrowLeft className="size-5" aria-hidden="true" />
                    </Carousel.PrevTrigger>

                    <Carousel.NextTrigger
                        className={({ isDisabled }) =>
                            `absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-fg-secondary shadow-lg ring-1 ring-border-secondary transition duration-100 ease-linear ${isDisabled ? "opacity-50" : "hover:bg-primary_hover"}`
                        }
                    >
                        <ArrowRight className="size-5" aria-hidden="true" />
                    </Carousel.NextTrigger>
                </div>

                <Carousel.IndicatorGroup className="flex items-center justify-center gap-2">
                    {({ index }) => (
                        <Carousel.Indicator
                            key={index}
                            index={index}
                            className={({ isSelected }) =>
                                `h-2 rounded-full transition-all duration-100 ease-linear ${isSelected ? "w-6 bg-brand-solid" : "w-2 bg-quaternary hover:bg-tertiary"}`
                            }
                        />
                    )}
                </Carousel.IndicatorGroup>
            </Carousel.Root>
        </div>
    ),
};

export const Vertical: Story = {
    render: () => (
        <div className="h-80 w-full max-w-3xl">
            <Carousel.Root orientation="vertical" className="flex h-full gap-4" opts={{ loop: true }}>
                <div className="relative h-full flex-1">
                    <Carousel.Content className="h-full">
                        {slides.slice(0, 4).map((slide) => (
                            <Carousel.Item key={slide.title}>
                                <div className={`flex h-full flex-col items-start justify-end gap-1 rounded-2xl p-8 text-white ${slide.className}`}>
                                    <p className="text-xl font-semibold">{slide.title}</p>
                                    <p className="text-sm text-white/80">{slide.description}</p>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel.Content>
                </div>

                <Carousel.IndicatorGroup className="flex flex-col items-center justify-center gap-2">
                    {({ index }) => (
                        <Carousel.Indicator
                            key={index}
                            index={index}
                            className={({ isSelected }) =>
                                `w-2 rounded-full transition-all duration-100 ease-linear ${isSelected ? "h-6 bg-brand-solid" : "h-2 bg-quaternary hover:bg-tertiary"}`
                            }
                        />
                    )}
                </Carousel.IndicatorGroup>
            </Carousel.Root>
        </div>
    ),
};
