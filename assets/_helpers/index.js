// Fonction utilitaire améliorée pour formater la date
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  // On compare les dates en ignorant les heures
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);

  // Si c'est aujourd'hui
  if (messageDate.getTime() === todayDate.getTime()) {
    return `${date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  // Si c'est hier
  else if (messageDate.getTime() === yesterdayDate.getTime()) {
    return "Hier";
  }
  // Si c'est plus ancien
  else {
    const diffTime = todayDate - messageDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    } else {
      return `${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString(
        "fr-FR",
        { hour: "2-digit", minute: "2-digit" }
      )}`;
    }
  }
};

// export const returnDate = (dateString) => {
//   if (!dateString) return "";

//   const now = new Date();

//   const date = new Date(dateString);

//   if (isNaN(date.getTime())) return "";
//   // On compare les dates en ignorant les heures
//   const messageDate = new Date(
//     date.getUTCFullYear(),
//     date.getUTCMonth(),
//     date.getUTCDate(),
//     date.getUTCHours(),
//     date.getUTCMinutes(),
//     date.getUTCSeconds()
//   );
//   const todayDate = new Date(
//     now.getUTCFullYear(),
//     now.getUTCMonth(),
//     now.getUTCDate(),
//     now.getUTCHours(),
//     now.getUTCMinutes(),
//     now.getUTCSeconds()
//   );

//   const diffDate = todayDate - messageDate;
//   console.log(
//     "todayDate:",
//     todayDate,
//     "messageDate",
//     messageDate,
//     "messageDateISO",
//     messageDate.toISOString(),
//     "dateString",
//     dateString
//   );

//   const diffMinute = Math.ceil(diffDate / (1000 * 60));
//   return diffMinute;
//   if (diffMinute <= 0) {
//     return "quelques instants";
//   } else if (diffMinute > 60) {
//     const diffHeure = Math.ceil(diffDate / (1000 * 60 * 60));
//     if (diffHeure < 24) {
//       return `${diffHeure} heure${diffHeure > 1 ? "s" : ""}`;
//     } else {
//       const diffDay = Math.ceil(diffDate / (1000 * 60 * 60 * 24));
//       if (diffDay <= 30) {
//         return `${diffDay} jour${diffDay > 1 ? "s" : ""}`;
//       } else {
//         const diffMounth = Math.ceil(diffDate / (1000 * 60 * 60 * 24 * 12));
//         if (diffMounth < 12) {
//           return `${diffMounth} mois`;
//         } else {
//           const diffYear = diffMounth - 12;
//           return `${diffYear} an${diffYear > 1 ? "s" : ""}`;
//         }
//       }
//     }
//   } else return `${diffMinute} minute${diffMinute > 1 ? "s" : ""}`;
// };

export const returnDate = (dateString) => {
  const date = new Date(dateString);

  // Extraire le jour, le mois et l'année
  const day = String(date.getDate()).padStart(2, "0"); // Ajoute un zéro si nécessaire
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const year = date.getFullYear();

  // Construire la date au format souhaité
  return `${day}-${month}-${year}`;
};
export default formatDate;
