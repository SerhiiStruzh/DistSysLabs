export class UserResponseDto {
    id: number;
    role: string;
    hourRate?: number;
    qualification?: string;

    constructor(id: number, role: string, hourRate?: number, qualification?: string) {
        this.id = id;
        this.role = role;

        if (hourRate !== undefined) {
            this.hourRate = hourRate;
        }

        if (qualification !== undefined) {
            this.qualification = qualification;
        }
    }
}
