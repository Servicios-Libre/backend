import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service.entity";

@Entity({
    name: "CATEGORIES"
})
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 50
    })
    name: string;

    @OneToMany(() => Service, (service: Service) => service.category)
    services: Service[];
};