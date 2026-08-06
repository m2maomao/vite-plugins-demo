/**
 * CHS 字典状态 store
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDictionaryStore = defineStore('chs-dictionary', () => {
  const dictionary = ref<Record<string, any>>({});

  function setDictionary(type: string, data: any) {
    dictionary.value[type] = data;
  }

  function getDictionary(type: string) {
    return dictionary.value[type];
  }

  return { dictionary, setDictionary, getDictionary };
});
