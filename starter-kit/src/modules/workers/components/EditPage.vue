<template>
  <PageTitle>Сотрудник</PageTitle>

  <CrudEditForm>
    <template #actions>
      <crud-button-secondary prepend-icon="mdi-email" @click="showInviteDialog">
        Пригласить
      </crud-button-secondary>
    </template>
    <template #default="{ stateProcessing }">
      <v-row>
        <v-col cols="12">
          <crud-input
            v-model="model.name"
            label="Имя"
            :disabled="stateProcessing"
            :rules="[r.required(), r.strMinLength(1), r.strMaxLength(255)]"
          />
        </v-col>
        <v-col cols="6">
          <crud-input
            v-model="model.mobile"
            label="Мобильный телефон"
            :disabled="stateProcessing"
            :rules="[r.required()]"
          />
        </v-col>
        <v-col cols="6">
          <crud-date-picker
            v-model="model.birthday"
            label="Дата рождения"
            :disabled="stateProcessing"
          />
        </v-col>
        <v-col cols="6">
          <crud-date-picker
            v-model="model.med_book"
            label="Медицинская книжка"
            :disabled="stateProcessing"
          />
        </v-col>
        <v-col cols="6">
          <crud-date-picker
            v-model="model.sud_sprav"
            label="Судебная справка"
            :disabled="stateProcessing"
          />
        </v-col>
        <v-col cols="12">
          <crud-input
            type="textarea"
            v-model="model.description"
            label="Описание"
            :disabled="stateProcessing"
            :rules="[r.strMaxLength(1000)]"
          />
        </v-col>
      </v-row>
    </template>
  </CrudEditForm>

  <InviteDialog
    v-model="inviteDialogVisible"
    :worker-id="model.id"
    @success="onInviteSuccess"
  />

</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import CrudEditForm from "@crud/components/forms/CrudEditForm.vue";
import CrudInput from "@crud/components/Inputs/CrudInput.vue";
import CrudButtonSecondary from "@crud/components/buttons/CrudButtonSecondary.vue";
import { useCrudEditPage } from "@crud/providers/useCrudEditPage";
import type { FormModel } from "@crud/types";
import r from "@crud/services/RulesService";
import InviteDialog from "./InviteDialog.vue";
import CrudDatePicker from "@crud/components/Inputs/CrudDatePicker.vue";
import PageTitle from "@crud/components/templates/PageTitle.vue";

interface WorkerItem extends FormModel {
  name: string;
  mobile: string;
  birthday: string | null;
  description: string;
  med_book: string;
  sud_sprav: string;
}

const editFormConfig = {
  model: ref({
    id: null,
    name: "",
    mobile: "",
    birthday: null,
    description: "",
    med_book: "",
    sud_sprav: "",
  }),
  prefixUrl: "/workers",
  backRoute: { name: "workersIndex" },
};

const editPageProvider = useCrudEditPage<WorkerItem>(editFormConfig);

const model = editPageProvider.model;

provide("editPageProvider", editPageProvider);

const inviteDialogVisible = ref(false);

const showInviteDialog = () => {
  inviteDialogVisible.value = true;
};

const onInviteSuccess = () => {
  inviteDialogVisible.value = false;
};
</script>