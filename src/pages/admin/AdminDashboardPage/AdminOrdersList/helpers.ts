export const getWhatsAppUrl = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, "");

  // Add India country code if number is 10 digits
  const whatsappPhone =
    cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
};

export const getGoogleMapsUrl = (
  latitude: number | null | undefined,
  longitude: number | null | undefined,
) => {
  if (latitude == null || longitude == null) {
    return "";
  }

  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};