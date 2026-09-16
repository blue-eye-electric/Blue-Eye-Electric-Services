import type { Order } from "../../types/order";
import type { Electrician } from "../../services/electricianService";
import logo from "../../assets/logo.webp";

type ServiceImageCardProps = {
  order: Order;
  assignedElectrician?: Electrician;
};

const ServiceImageCard = ({
  order,
  assignedElectrician,
}: ServiceImageCardProps) => {
  return (
    <div className="box-border min-h-[1080px] w-[1080px] bg-white p-[60px] text-black border border-primary rounded-4xl">
      <img
        src={logo}
        alt=""
        className="pointer-events-none absolute inset-0 m-auto object-contain opacity-10"
      />
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b-[3px] border-gray-200 pb-[30px]">
        <img src={logo} alt="Blue Eye Electric Logo" className="w-[100px]" />

        <div className="mt-2 text-4xl text-primary font-bold">
          Service Completion Receipt
        </div>
      </div>

      {/* Order ID */}
      <div className="mb-8 flex justify-between">
        <div>
          <div className="font-bold uppercase text-slate-500 whitespace-nowrap">
            Order ID
          </div>

          <div className="mt-1.5 text-4xl font-bold">#{order.id}</div>
        </div>

        <div className="text-right">
          <div className="font-bold uppercase tracking-[1px] text-slate-500">
            Received
          </div>

          <div className="mt-1.5 text-xl whitespace-nowrap">
            {new Date(order.created_at).toLocaleString("en-IN", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        </div>
      </div>

      {/* Customer */}
      <Section title="Customer">
        <div className="flex flex-col gap-2">
          <Info label="Name" value={order.customer_name} />
          <Info label="Phone" value={order.customer_phone} />

          {order.service_area && (
            <Info label="Service Area" value={order.service_area} />
          )}
        </div>
      </Section>

      {/* Service */}
      <Section title="Service">
        <Info
          label="Service Type"
          value={order.service_type || "Inspection Visit"}
        />

        {order.description && (
          <Info label="Description" value={order.description} />
        )}
      </Section>

      {/* Schedule */}
      <Section title="Schedule">
        <div>
          <Info label="Date" value={order.service_date} />
          <Info label="Time" value={order.service_time} />
        </div>
      </Section>

      {/* Location */}
      <Section title="Service Location">
        <div className="leading-[1.5]">{order.customer_address}</div>
      </Section>

      {/* Electrician */}
      {assignedElectrician && (
        <Section title="Assigned Electrician">
          <div className="grid grid-cols-2 gap-[25px]">
            <Info label="Name" value={assignedElectrician.name} />

            <Info label="Phone" value={assignedElectrician.mobile_number} />

            {assignedElectrician.service_area && (
              <Info
                label="Service Area"
                value={assignedElectrician.service_area}
              />
            )}
          </div>
        </Section>
      )}

      {/* Payment */}
      {typeof order.total_amount === "number" && (
        <div className="mt-[30px] rounded-[18px] border border-slate-200 bg-slate-50 px-[30px] py-[25px]">
          <div className="mb-3 font-bold uppercase tracking-[1px] text-slate-500">
            Payment Summary
          </div>

          {/* {order.payment_details && order.payment_details.length > 0 && (
            <div>
              {order.payment_details.map((detail, index) => (
                <div
                  key={`${detail.description}-${index}`}
                  className={`flex justify-between py-2.5 ${
                    index !== order.payment_details!.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <span>{detail.description}</span>

                  <span className="font-semibold">
                    ₹{detail.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )} */}

          <div className="flex items-center justify-between border-t-2 border-slate-300 pt-[18px]">
            <div>
              <div className="text-slate-500">Payment Mode</div>

              <div className="mt-1 text-lg font-bold">
                {order.mode_of_payment === "UPI" ? "UPI" : "Cash"}
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-500">Total Amount</div>

              <div className="mt-1 text-3xl font-extrabold">
                ₹{order.total_amount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-[45px] border-t border-gray-200 pt-[22px] text-center text-[16px] text-slate-500">
        Thank you for choosing Blue Eye Electric
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-[25px] rounded-[18px] border border-slate-200 px-[30px] py-[25px]">
      <div className="mb-[18px] text-[15px] font-bold uppercase tracking-[1px] text-slate-500">
        {title}
      </div>

      {children}
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="text-slate-500">{label}</div>
      <span>:</span>
      <div className="font-semibold leading-[1.4]">{value}</div>
    </div>
  );
};

export default ServiceImageCard;
