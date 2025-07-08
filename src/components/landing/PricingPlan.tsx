import { PRICING_PLAN } from "@/constants/pricingPlan";

const PricingPlan = () => {
  return (
    <section className="h-[calc(100vh+30px)] w-full flex flex-col items-center justify-center bg-gradient-to-b from-main/60 to-main/20">
      요금제 업그레이드
      <div className="flex gap-[20px]">
        {PRICING_PLAN.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-[16px] border border-black h-[350px] w-[300px] pt-[20px] px-[20px]"
          >
            <h1 className="font-nanum-extrabold text-[30px]">{plan.name}</h1>
            <h1 className="text-[20px]">
              <span className="font-nanum-bold">{plan.price}</span> 원/월
            </h1>
            <div className="">
              {plan.features.map((feature) => (
                <p>{feature}</p>
              ))}
            </div>
            <button className="rounded-full bg-[#7752fe] text-white py-[6px] text-[15px]">
              {plan.name} 이용하기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingPlan;
