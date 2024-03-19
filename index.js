import { chat, is_send_press } from '../../../../script.js';
import { executeSlashCommands } from '../../../slash-commands.js';
import { delay } from '../../../utils.js';

const loop = async () => {
    while (true) {
        const response = await fetch('/api/plugins/stahp/ex/poll');
        if (response.ok) {
            const queue = await response.json();
            for (const item of queue) {
                switch (item.action) {
                    case 'executeSlashCommands': {
                        const result = (await executeSlashCommands(item.command))?.pipe ?? '';
                        await fetch('/api/plugins/stahp/ex/response', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: item.id,
                                result,
                            }),
                        });
                        break;
                    }
                    case 'send': {
                        document.querySelector('#send_textarea').value = item.message;
                        document.querySelector('#send_but').click();
                        await delay(100);
                        while (is_send_press) await delay(100);
                        const result = chat.slice(-1)[0];
                        await fetch('/api/plugins/stahp/ex/response', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: item.id,
                                result,
                            }),
                        });
                        break;
                    }
                    default: {
                        await fetch('/api/plugins/stahp/ex/response', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: item.id,
                                error: 'not implemented',
                            }),
                        });
                        break;
                    }
                }
            }
        }
        await delay(100);
    }
};
loop();
