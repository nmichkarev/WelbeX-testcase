import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { extname } from "path";
import * as uuid from 'uuid';

const mediaFileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
    const allowedReg = /\.(jpg|jpeg|png|gif|mpeg|mp4|webm|ogg|3gpp)$/;

    if (!file.originalname.match(allowedReg)) {
        return callback(
            new HttpException(
                'Only image and video files are allowed!', 
                HttpStatus.BAD_REQUEST
            ), 
            false
        );
    }

    callback(null, true);
};

const editFileName = (req: Request, file: Express.Multer.File, callback: Function) => {
    const fileExtName = extname(file.originalname);
    callback(null, uuid.v4() + fileExtName);
}

export { mediaFileFilter, editFileName };