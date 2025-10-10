import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwt: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const auth = req.headers['authorization'];
        if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing token');
        const token = auth.substring(7);
        try {
            const payload = await this.jwt.verifyAsync(token);
            req.user = payload;
            return true;
        } catch(e: any) {
            // Helpful debug: if invalid signature, log header.alg from token if available
            try {
                const decoded = jwt.decode(token, { complete: true }) as any;
                console.warn('JWT verify failed. token header:', decoded?.header);
            } catch (err) {
                // ignore
            }
            console.log(e?.message || e);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
