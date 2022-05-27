import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { ApiProperty } from '@nestjs/swagger';

interface PostCreationAttrs {
    content: string;
    userId: number;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Unique identifier' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ description: 'Blog post text including image and video tags' })
    @Column({ type: DataType.TEXT, defaultValue: '' })
    content: string;

    @ApiProperty({ description: 'Post creation date and time' })
    readonly createdAt: Date;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @ApiProperty({ description: 'Post author', type: User })
    @BelongsTo(() => User)
    author: User;
}