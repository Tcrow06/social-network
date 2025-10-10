import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFile } from 'fs/promises'
import { join } from 'path'

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private templateCache: Record<string, string | null> = {}
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.MAIL_AUTH_USER, pass: process.env.MAIL_AUTH_PASS },
        });
    }

    private async loadTemplate(name: string) {
        if (this.templateCache[name] !== undefined) return this.templateCache[name]
        const candidates = [
            join(__dirname, 'templates', `${name}.html`),
            join(process.cwd(), 'src', 'mail', 'templates', `${name}.html`),
            join(process.cwd(), 'dist', 'src', 'mail', 'templates', `${name}.html`),
            join(process.cwd(), 'dist', 'mail', 'templates', `${name}.html`),
        ]

        for (const p of candidates) {
            try {
                const content = await readFile(p, { encoding: 'utf8' })
                this.templateCache[name] = content
                return content
            } catch (e) {
                // try next candidate
            }
        }

        // nothing found
        this.templateCache[name] = null
        console.warn(`Mail template not found for ${name}. Tried: ${candidates.join(', ')}`)
        return null
    }

    async sendOtpMail(to: string, otp: string, name?: string, website?: string) {
        try {
            const expireMinutes = 5
            const tpl = await this.loadTemplate('verify-email')
            const html = tpl
                ? tpl.replace(/{{otp}}/g, otp).replace(/{{name}}/g, name || '').replace(/{{website}}/g, website || process.env.APP_URL || '')
                : `<p>Mã OTP của bạn là <b>${otp}</b>. Mã sẽ hết hạn trong ${expireMinutes} phút.</p>`

            const text = `Mã OTP của bạn là ${otp}. Mã sẽ hết hạn trong ${expireMinutes} phút.`

            await this.transporter.sendMail({
                from: `Teleface <${process.env.MAIL_AUTH_USER}>`,
                to,
                subject: 'Mã OTP để xác thực email',
                text,
                html,
            })
        } catch (e) {
            console.error('Mail send error', e)
            throw new InternalServerErrorException('Gửi email thất bại')
        }
    }

    async sendPostDeletedMail(to: string, snippet: string, reason?: string) {
        try {
            const tpl = await this.loadTemplate('post-deleted')
            const html = tpl ? tpl.replace(/{{snippet}}/g, snippet) : `<p>Bài viết của bạn đã bị xóa.</p><p>${snippet}</p>`
            const text = `Bài viết của bạn đã bị xóa.\n\n${snippet}`
            await this.transporter.sendMail({
                from: `Teleface <${process.env.MAIL_AUTH_USER}>`,
                to,
                subject: 'Bài viết của bạn đã bị xóa',
                text,
                html,
            })
        } catch (e) {
            console.error('Mail send error', e)
            // don't throw to avoid blocking the main flow; log instead
        }
    }
}
