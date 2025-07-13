import { Request, Response } from "express";
import { userService } from "../service/user.service";

class UserController {
  async getStats(req: Request, res: Response) {
    try {
      const uid = (req as any).uid;

      if (!uid) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const stats = await userService.getUserStats(uid);
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const uid = (req as any).uid;

      if (!uid) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const progress = await userService.getProgress(uid);
      return res.status(200).json(progress);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao obter progresso" });
    }
  }

  async getBadges(req: Request, res: Response) {
    try {
      const uid = (req as any).uid;

      if (!uid) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const badges = await userService.getBadges(uid);
      return res.status(200).json(badges);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao obter conquistas" });
    }
  }

  async getModules(req: Request, res: Response) {
    try {
      const { grade, subject, difficulty } = req.query;

      if (!grade || !subject || !difficulty) {
        return res
          .status(400)
          .json({ error: "Parâmetros obrigatórios não informados." });
      }

      const modules = await userService.getModules(
        grade as string,
        subject as string,
        difficulty as string
      );
      return res.json(modules);
    } catch (error) {
      console.error("Erro ao buscar módulos:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async getModuleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const module = await userService.getModuleById(id);
      if (!module) {
        return res.status(404).json({ error: "Módulo não encontrado" });
      }

      return res.status(200).json(module);
    } catch (error) {
      console.error("Erro ao buscar módulo:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async completeLesson(req: Request, res: Response) {
    try {
      const uid = (req as any).uid;
      const { moduleId, lessonId } = req.body;

      if (!uid || !moduleId || !lessonId) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      await userService.completeLesson(uid, moduleId, lessonId);
      return res.status(200).json({ message: "Aula marcada como concluída!" });
    } catch (error) {
      console.error("Erro ao concluir aula:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}

export const userController = new UserController();
