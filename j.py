def write_to_csv(dir, results_fold, dataset_name, class_names, n_images_fold, base_model_name, model_params, aug_params, outer_fold_nr, groupsDict, testType):

  csv_dir = os.path.join(dir, "Results")

  print(csv_dir)

  if not os.path.exists(csv_dir):
    os.mkdir(csv_dir)

  #now = datetime.now()
  #d1 = now.strftime("%d-%m-%Y_%H:%M:%S")

  folder_name = "Neurons " + str(model_params["nr_hidden_neurons"]) + "_dropout " + str(model_params["dropout_rate"]) + "_min delta " + str(model_params["min_delta"]) + "_patience " + str(model_params["patience"]) + "_optimizer " + str(model_params["optimizer"])
  config_dir = os.path.join(csv_dir,folder_name)

  if not os.path.exists(config_dir):
    os.mkdir(config_dir)

  final_dir = config_dir
  if aug_params:
    aug_dir_name = "No_augmentation"
    if aug_params["augment_all"]:
      aug_dir_name = "Augmented all " + str(aug_params["n_images_all"])
    if aug_params["augment_all"] and aug_params["augment_train"]:
      aug_dir_name += "_"
      if aug_params["augment_train"]:
        aug_dir_name += "Augmented train " + str(aug_params["n_images_all"])
    elif aug_params["augment_train"]:
        aug_dir_name = "Augmented train " + str(aug_params["n_images_all"])
    aug_dir = os.path.join(config_dir, aug_dir_name)
    if not os.path.exists(aug_dir):
      os.mkdir(aug_dir)
    final_dir = aug_dir

  file_path = os.path.join(final_dir, dataset_name)
  print(file_path)
  filename1 = file_path + ".csv"
  filename2 = file_path + "_Classific_Report.csv"
  filename3 = file_path + "_Conf_Matrix.json"

  exists1 = os.path.exists(filename1)
  exists2 = os.path.exists(filename2)
  exists3 = os.path.exists(filename3)

  # CSV files
  with open(filename1, 'a') as writefile1, open(filename2, 'a') as writefile2:

    # Write headers
    if not exists1:
      header1 = "Test_Type,n_subj_test,FullAugmentation,FullAugFactor,TrainAugFactor,TrainAugmentation,pre_trained_model,outer_fold,inner_fold,epoch,loss,categorical_acc,val_loss,val_categorical_acc,epoch_time (s),test_time (s)," +\
                "TrainSubjects,TestSubjects\n"
      writefile1.write(header1)

    if not exists2:
      header2 = "Test_Type,n_subj_test,FullAugmentation,FullAugFactor,TrainAugFactor,TrainAugmentation,pre_trained_model,subject,outer_fold,inner_fold,epochs,"
      for class_name in class_names:
        header2 += class_name + "_precision," + class_name + "_recall," + class_name + "_f1," + class_name + "_support,"
      header2 += "macro_avg_precision,macro_avg_recall,macro_avg_f1,macro_avg_support," +\
        "weighted_avg_precision,weighted_avg_recall,weighted_avg_f1,weighted_avg_support," +\
        "accuracy,balanced_accuracy," +\
        "train_time (s),predict_time (s),n_train_images,n_val_images,n_test_images,TrainSubjects,TestSubjects\n"
      writefile2.write(header2)

    if aug_params["augment_all"] == True and aug_params["augment_train"] == True:
      toAdd = str(aug_params["augment_all"]) + "," + str(aug_params["n_images_all"]) + "," + str(aug_params["augment_train"]) + "," + str(aug_params["n_images_train"])
    elif aug_params["augment_all"] == True and aug_params["augment_train"] == False:
      toAdd = str(aug_params["augment_all"]) + "," + str(aug_params["n_images_all"]) + "," + str(aug_params["augment_train"]) + "," + "None"
    elif aug_params["augment_all"] == False and aug_params["augment_train"] == True:
      toAdd = str(aug_params["augment_all"]) + "," + "None" + ","  + str(aug_params["augment_train"]) + "," + str(aug_params["n_images_train"])
    else:
      toAdd = str(aug_params["augment_all"]) + "," + "None" + ","  + str(aug_params["augment_train"]) + "," + "None"

    # Write results
    # File 2 (folds)
    data_str = get_report_results_str(results_fold["classif_report"], results_fold["balanced_acc"], results_fold["inc_history"], results_fold["times"], \
                                      n_images_fold, class_names, "All", base_model_name, aug_params, toAdd, outer_fold_nr, groupsDict, testType)
    writefile2.write(data_str)

    if ("groups" in results_fold) and results_fold["groups"] and (len(results_fold["groups"]) > 0) and (len(results_fold["groups"][0]) > 1):
      subj_ind = 0

      groups = results_fold["groups"][0]

      for subj_ind in range(len(groups)):
        subj_name = groups[subj_ind]
        print(groups[subj_ind])

        classific_report = list()
        balanced_acc = list()

        for classific_report_group, balanced_acc_group in zip(results_fold["classif_report_groups"], results_fold["balanced_acc_groups"]):
          classific_report.append(classific_report_group[subj_ind])
          balanced_acc.append(balanced_acc_group[subj_ind])

        data_str = get_report_results_str(classific_report, balanced_acc, None, None, None, class_names, subj_name, base_model_name, aug_params, toAdd, outer_fold_nr, groupsDict, testType)
        writefile2.write(data_str)

    # File 1 (epochs)
    fold_nr = 0
    for fold in results_fold["inc_history"]:
      # trainSubject, testSubject = groupsDict[fold_nr].replace("'","").replace("}","").replace("{","").split("/")
      for epoch in range(len(fold.history["loss"])):
        data_str = testType + ","
        if groupsDict is not None:
          data_str += str(len(groupsDict[fold_nr]["test"]))
        else:
          data_str += str(0)
        data_str += "," + toAdd + "," + base_model_name +","+ str((outer_fold_nr)) +","+ str(fold_nr+1) + "," + str(epoch + 1) + "," +\
           str(fold.history["loss"][epoch]) + "," + str(fold.history["categorical_accuracy"][epoch]) + "," +\
           str(fold.history["val_loss"][epoch]) + "," + str(fold.history["val_categorical_accuracy"][epoch]) + "," +\
           str(results_fold["times"][fold_nr].epoch_times[epoch]) + "," + str(results_fold["times"][fold_nr].test_times[epoch])
        if groupsDict is not None:
          data_str += "," + ";".join(groupsDict[fold_nr]["train"]) + "," + ";".join(groupsDict[fold_nr]["test"]) + "\n"
        else:
          data_str += ",,\n"
        writefile1.write(data_str)
      fold_nr += 1

  # JSON file
  json_data = {"cm_results": []}
  if exists3:
    with open(filename3, "r") as readfile3:
      json_data = json.load(readfile3)

  cm_results = {"pre_trained_model": base_model_name, "labels": class_names, "cm_info": []}

  cm_info_all = {"subject": "All", "folds": []}
  for cm in results_fold["cm"]:
    cm_info_all["folds"].append(cm.tolist())
  cm_results["cm_info"].append(cm_info_all)

  if ("groups" in results_fold) and results_fold["groups"] and (len(results_fold["groups"]) > 0) and (len(results_fold["groups"][0]) > 1):
    group_ind = 0
    for group in results_fold["groups"][0]:
      cm_info_group = {"subject": group, "folds": []}
      for cm_groups_fold in results_fold["cm_groups"]:
        cm_info_group["folds"].append(cm_groups_fold[group_ind].tolist())

      cm_results["cm_info"].append(cm_info_group)
      group_ind += 1

  json_data["cm_results"].append(cm_results)

  with open(filename3, "w") as writefile3:
    json.dump(json_data, writefile3)

  #print(inc_history_fold.history)
  #print(classif_report_fold)
  #print(balanced_acc_fold)


def get_report_results_str(report_folds, balanced_acc_folds, inc_history_fold, times_fold, n_images_fold, class_names, group_name, base_model_name, aug_params, toAdd, outer_fold_nr, groupsDict, testType):

  data_str = ""

  # print(report_folds)
  # print(class_names)

  fold_nr = 0
  for report in report_folds:
    # trainSubject, testSubject = groupsDict[fold_nr].replace("'","").replace("}","").replace("{","").split("/")

    data_str += testType + ","
    if groupsDict is not None:
       data_str += str(len(groupsDict[fold_nr]["test"]))
    else:
       data_str += str(0)
    data_str += "," + toAdd + "," + base_model_name + "," + group_name

    if outer_fold_nr is not None:
      data_str += "," + str(outer_fold_nr)

    data_str += "," + str(fold_nr+1) + ","

    if inc_history_fold is not None:
       data_str += str(len(inc_history_fold[fold_nr].history['loss']))

    for class_name in class_names:
      data_str += "," + str(report[class_name]["precision"]) + "," + str(report[class_name]["recall"]) + "," + str(report[class_name]["f1-score"]) + "," + str(report[class_name]["support"])

    data_str += "," + str(report["macro avg"]["precision"]) + "," + str(report["macro avg"]["recall"]) + "," + str(report["macro avg"]["f1-score"]) + "," + str(report["macro avg"]["support"]) + "," +\
        str(report["weighted avg"]["precision"]) + "," + str(report["weighted avg"]["recall"]) + "," + str(report["weighted avg"]["f1-score"]) + "," + str(report["weighted avg"]["support"]) + "," +\
        str(report["accuracy"]) + "," + str(balanced_acc_folds[fold_nr])

    if times_fold is not None:
        data_str += "," + str(times_fold[fold_nr].train_times[0]) + "," + str(times_fold[fold_nr].predict_times[0])
    else:
        data_str += ",,"

    if n_images_fold is not None:
      if aug_params is not None and "augment_train" in aug_params and aug_params["augment_train"] is True:
        data_str += "," + str(n_images_fold["train_aug"][fold_nr])
      else:
        data_str += "," + str(n_images_fold["train"][fold_nr])

      data_str += "," + str(n_images_fold["val"][fold_nr]) + "," + str(n_images_fold["test"][fold_nr]) + ","
      if groupsDict is not None:
        data_str += ";".join(groupsDict[fold_nr]["train"]) + "," + ";".join(groupsDict[fold_nr]["test"]) + "\n"
      else:
        data_str += ",\n"
    else:
      data_str += ",,,,\n"

    fold_nr += 1

  return data_str