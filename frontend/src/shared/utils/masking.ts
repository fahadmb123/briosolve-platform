export const maskEmail = (emailAddress: string) => {
    if (!emailAddress) return "";
    const [username, domain] = emailAddress.split('@');
    if (!username || !domain) return emailAddress;
    
    if (username.length > 2) {
        return `${username.substring(0, 2)}${'*'.repeat(Math.max(0, username.length - 3))}${username.substring(username.length - 1)}@${domain}`;
    }
    return `${username[0]}*@${domain}`;
}

export const maskPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "";

    const cleaned = phoneNumber.replace(/[\s-]/g, "");

    if (cleaned.length < 6) return cleaned;

    const start = cleaned.substring(0, 3);
    const end = cleaned.substring(cleaned.length - 4);
   
    const maskLength = Math.max(0, cleaned.length - 7);

    return `${start}${'*'.repeat(maskLength)}${end}`
}
