import { countryCodes } from "@/api/countryCodes";
function PhoneInput() {
  return (
    <select>
      {countryCodes.map((country) => (
        <option key={country.code} value={country.dial_code}>
          {country.code} ({country.dial_code})
        </option>
      ))}
    </select>
  );
}

export default PhoneInput;