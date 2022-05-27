import { Controller, Get, Request, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class AppController {
    @Get()
    root(@Request() req, @Res() res: Response) {
        res.render('index');
    }
}
