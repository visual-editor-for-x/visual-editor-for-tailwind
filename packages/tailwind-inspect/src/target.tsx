/* This example requires Tailwind CSS v2.0+ */

const features = [
  {
    name: "Competitive exchange rates",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: "heroicons-outline:globe-alt",
  },
  {
    name: "No hidden fees",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: "heroicons-outline:scale",
  },
  {
    name: "Transfers are instant",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: "heroicons-outline:lightning-bolt",
  },
  {
    name: "Mobile notifications",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: "heroicons-outline:annotation",
  },
];

export default function Demo() {
  return (
    (<div className="py-12 bg-[#fff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="sm:text-4xl mt-[8px] text-[#111827] font-[800] text-[30px] leading-[32px] tracking-[-0.025em]">
            A better way to send money
          </p><h2 className="uppercase text-[#4f46e5] font-[600] text-[16px] tracking-[0.025em]">
          Transactions
        </h2>
            
          <p className="max-w-2xl lg:mx-auto mt-[16px] text-[#6b7280] text-[20px]">
            Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam
            voluptatum cupiditate veritatis in accusamus quisquam.
          </p>
        </div>

        <div className="mt-[40px]">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="rounded-md absolute w-[48px] h-[48px] flex items-center justify-center text-[#fff] bg-[#6366f1]">
                    <iconify-icon
                      icon={feature.icon}
                      class="h-6 w-6 text-2xl"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="ml-[64px] text-[#111827] font-[500] text-[18px] leading-[24px]">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-[8px] ml-[64px] text-[#6b7280] text-[16px]">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <>
          <div>Fragment Item 1</div>
          <div>Fragment Item 2</div>
        </>
      </div>
    </div>)
  );
}
