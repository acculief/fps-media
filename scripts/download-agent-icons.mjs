#!/usr/bin/env node
/**
 * ZZZ Fandom Wikiからエージェントアイコンをダウンロードするスクリプト。
 * 保存先: public/images/agents/{name}.png
 *
 * 使い方:
 *   node scripts/download-agent-icons.mjs
 */

import fs from "fs";
import path from "path";

const DEST_DIR = path.join(process.cwd(), "public/images/agents");
const TIMEOUT_MS = 30_000;
const THUMB_SIZE = 80;

// Fandom Wiki file name → local file name
const ICONS = {
  // S級
  "Agent_Nekomiya_Mana_Icon.png": "nekomata.png",
  "Agent_Ellen_Joe_Icon.png": "ellen.png",
  "Agent_Von_Lycaon_Icon.png": "lycaon.png",
  "Agent_Luciana_de_Montefio_Icon.png": "rina.png",
  "Agent_Koleda_Belobog_Icon.png": "koleda.png",
  "Agent_Grace_Howard_Icon.png": "grace.png",
  "Agent_Lighter_Icon.png": "lighter.png",
  "Agent_Burnice_White_Icon.png": "burnice.png",
  "Agent_Caesar_King_Icon.png": "caesar.png",
  "Agent_Soldier_11_Icon.png": "soldier11.png",
  "Agent_Seed_Icon.png": "seed.png",
  "Agent_Trigger_Icon.png": "trigger.png",
  "Agent_Soldier_0_-_Anby_Icon.png": "soldier0-anby.png",
  "Agent_Zhu_Yuan_Icon.png": "zhuyuan.png",
  "Agent_Qingyi_Icon.png": "qingyi.png",
  "Agent_Jane_Doe_Icon.png": "janedoe.png",
  "Agent_Hoshimi_Miyabi_Icon.png": "miyabi.png",
  "Agent_Tsukishiro_Yanagi_Icon.png": "yanagi.png",
  "Agent_Asaba_Harumasa_Icon.png": "harumasa.png",
  "Agent_Evelyn_Chevalier_Icon.png": "evelyn.png",
  "Agent_Astra_Yao_Icon.png": "astra-yao.png",
  "Agent_Hugo_Vlad_Icon.png": "hugo.png",
  "Agent_Vivian_Banshee_Icon.png": "vivian.png",
  "Agent_Ye_Shunguang_Icon.png": "ye-shunguang.png",
  "Agent_Ju_Fufu_Icon.png": "ju-fufu.png",
  "Agent_Yixuan_Icon.png": "yixuan.png",
  "Agent_Alice_Thymefield_Icon.png": "alice.png",
  "Agent_Ukinami_Yuzuha_Icon.png": "yuzuha.png",
  "Agent_Lucia_Elowen_Icon.png": "lucia.png",
  "Agent_Yidhari_Murphy_Icon.png": "yidhari.png",
  "Agent_Dialyn_Icon.png": "dialyn.png",
  "Agent_Zhao_Icon.png": "zhao.png",
  "Agent_Banyue_Icon.png": "banyue.png",
  "Agent_Nangong_Yu_Icon.png": "chinatsu.png",
  "Agent_Sunna_Icon.png": "sunna.png",
  "Agent_Cissia_Icon.png": "cissia.png",
  // A級
  "Agent_Billy_Kid_Icon.png": "billy.png",
  "Agent_Nicole_Demara_Icon.png": "nicole.png",
  "Agent_Anby_Demara_Icon.png": "anby.png",
  "Agent_Corin_Wickes_Icon.png": "corin.png",
  "Agent_Anton_Ivanov_Icon.png": "anton.png",
  "Agent_Ben_Bigger_Icon.png": "ben.png",
  "Agent_Soukaku_Icon.png": "soukaku.png",
  "Agent_Seth_Lowell_Icon.png": "seth.png",
  "Agent_Aria_Icon.png": "lucy.png",
  "Agent_Piper_Wheel_Icon.png": "piper.png",
  "Agent_Pulchra_Fellini_Icon.png": "pulchra.png",
  "Agent_Pan_Yinhu_Icon.png": "pan-yinhu.png",
  "Agent_Komano_Manato_Icon.png": "komano-manato.png",
  // オルペウス&「鬼火」
  "Agent Orphie Magnusson & Magus Icon.png": "orpheus.png",
};

async function getFandomImageUrl(fileName) {
  const apiUrl = `https://zenless-zone-zero.fandom.com/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&iiurlwidth=${THUMB_SIZE}&format=json`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "ZenZeroNews-IconDownloader/1.0" },
    });
    clearTimeout(timer);
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    const info = page?.imageinfo?.[0];
    // thumburl for resized, or url for original
    return info?.thumburl || info?.url || null;
  } catch (e) {
    clearTimeout(timer);
    console.error(`  API error for ${fileName}: ${e.message}`);
    return null;
  }
}

async function downloadFile(url, destPath) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "ZenZeroNews-IconDownloader/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return { ok: false, status: res.status };
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return { ok: true, size: buffer.length };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, error: e.message };
  }
}

async function main() {
  fs.mkdirSync(DEST_DIR, { recursive: true });

  const entries = Object.entries(ICONS);
  console.log(`\nエージェントアイコン: ${entries.length}件をダウンロードします\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [wikiFile, localFile] of entries) {
    const destPath = path.join(DEST_DIR, localFile);

    if (fs.existsSync(destPath)) {
      skipped++;
      continue;
    }

    process.stdout.write(`  ${localFile} ...`);

    const imageUrl = await getFandomImageUrl(wikiFile);
    if (!imageUrl) {
      console.log(" ✗ (URL取得失敗)");
      failed++;
      continue;
    }

    const result = await downloadFile(imageUrl, destPath);
    if (result.ok) {
      downloaded++;
      const sizeKB = Math.round(result.size / 1024);
      console.log(` ✓ (${sizeKB}KB)`);
    } else {
      failed++;
      console.log(` ✗ (${result.status || result.error})`);
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`完了: ${downloaded}件DL, ${skipped}件スキップ, ${failed}件失敗`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
