import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const htmlPath = path.join(process.cwd(), 'biblical_aviary_explorer.html');
const html = fs.readFileSync(htmlPath, 'utf8');

test('verse cards provide LEV and DEU tabs for each translation', () => {
    const translations = ['bsi-ov', 'bsi-cl', 'mcv', 'poc', 'kjv', 'niv', 'ylt', 'nkjv'];

    for (const translation of translations) {
        assert.match(html, new RegExp(`data-translation="${translation}"`));
    }

    assert.equal((html.match(/data-verse-tab="lev"/g) || []).length, 8);
    assert.equal((html.match(/data-verse-tab="deu"/g) || []).length, 8);
    assert.equal((html.match(/data-verse-panel="lev"/g) || []).length, 8);
    assert.equal((html.match(/data-verse-panel="deu"/g) || []).length, 8);
    assert.match(html, /function switchVerseTab\(button, book\)/);
});

test('BSI OV card includes both Leviticus and Deuteronomy passages', () => {
    assert.match(
        html,
        /data-translation="bsi-ov"[\s\S]*?data-verse-panel="lev"[\s\S]*?ലേവ്യ 11:13 പക്ഷികളിൽ നിങ്ങൾക്കു അറെപ്പായിരിക്കേണ്ടുന്നവ ഇവ/
    );

    assert.match(
        html,
        /data-translation="bsi-ov"[\s\S]*?data-verse-panel="deu"[\s\S]*?പക്ഷികളിൽ തിന്നരുതാത്തവ: കടൽറാഞ്ചൻ, ചെമ്പരുന്തു, കഴുകൻ/
    );
});