import { useState } from "react";

// Icons
import { Wrench } from "lucide-react";

const ElectricianAvatar = ({
  photoUrl,
  name,
}: {
  photoUrl?: string | null;
  name: string;
}) => {
  const [imageError, setImageError] = useState(false);

  if (!photoUrl || imageError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Wrench className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      className="h-full w-full object-cover"
      onError={() => setImageError(true)}
    />
  );
};

export default ElectricianAvatar;
