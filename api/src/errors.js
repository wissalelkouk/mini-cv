export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(req, res, next) {
  next(new HttpError(404, "Route introuvable"));
}

export function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message;
  if (err.type === "entity.parse.failed") message = "JSON invalide";
  if (err.type === "entity.too.large") message = "Corps de requête trop volumineux";
  if (status >= 500) {
    console.error(err);
    status = 500;
    message = "Erreur interne du serveur";
  }
  res.status(status).json({ status: "error", message, ...(err.details && { details: err.details }) });
}
