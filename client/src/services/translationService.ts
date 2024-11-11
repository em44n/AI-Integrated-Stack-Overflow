/* eslint-disable no-console */
import axios from 'axios';

const API_URL =
  'https://api-inference.huggingface.co/models/facebook/mbart-large-50-many-to-many-mmt';
const API_KEY = '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';

interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}

interface TranslationResponse {
  translation_text: string;
}

// Arabic (ar_AR), Czech (cs_CZ), German (de_DE), English (en_XX), Spanish (es_XX), Estonian (et_EE),
// Finnish (fi_FI), French (fr_XX), Gujarati (gu_IN), Hindi (hi_IN), Italian (it_IT), Japanese (ja_XX)
// Kazakh (kk_KZ), Korean (ko_KR), Lithuanian (lt_LT), Latvian (lv_LV), Burmese (my_MM), Nepali (ne_NP)
// Dutch (nl_XX), Romanian (ro_RO), Russian (ru_RU), Sinhala (si_LK), Turkish (tr_TR), Vietnamese (vi_VN)
// Chinese (zh_CN), Afrikaans (af_ZA), Azerbaijani (az_AZ), Bengali (bn_IN), Persian (fa_IR), Hebrew (he_IL)
// Croatian (hr_HR), Indonesian (id_ID), Georgian (ka_GE), Khmer (km_KH), Macedonian (mk_MK), Malayalam (ml_IN)
// Mongolian (mn_MN), Marathi (mr_IN), Polish (pl_PL), Pashto (ps_AF), Portuguese (pt_XX), Swedish (sv_SE)
// Swahili (sw_KE), Tamil (ta_IN), Telugu (te_IN), Thai (th_TH), Tagalog (tl_XX), Ukrainian (uk_UA)
// Urdu (ur_PK), Xhosa (xh_ZA), Galician (gl_ES), Slovene (sl_SI)
const translateText = async (data: TranslationRequest): Promise<string | null> => {
  try {
    const response = await axios.post<TranslationResponse[]>(
      API_URL,
      { inputs: data.text, parameters: { src_lang: data.source_lang, tgt_lang: data.target_lang } },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data[0].translation_text;
  } catch (error) {
    console.error('Error translating text:', error);
    return null;
  }
};

export default translateText;
