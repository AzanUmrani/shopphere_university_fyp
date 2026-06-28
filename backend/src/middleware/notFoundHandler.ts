import { Request, Response, NextFunction } from "express";
import { notFoundHandler as notFound } from "./errorHandler";

export const notFoundHandler = notFound;
