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

export default formatDate;
